from flask import Flask, request, jsonify,json,send_file
import mysql.connector
from flask_cors import CORS
from flask_cors import cross_origin
from collections import defaultdict
import collections
import numpy as np
from numpy import mean
from datetime import datetime

import jwt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from math import sqrt
from sklearn.metrics import confusion_matrix, accuracy_score
from reportlab.lib.pagesizes import letter,landscape
from reportlab.pdfgen import canvas
import pandas as pd
from io import BytesIO

import random
app = Flask(__name__)
SECRET_KEY = 'i-bPuLfCdEspfqv5cI1A6__bsEtnJOGKdbNmhbLKQAA'

#app.config['CORS_ORIGINS'] = ['http://localhost:3000']
CORS(app)
#CORS(app, origins='*', headers='Content-Type')
CORS(app, resources={r"/api/*": {"origins": "*"}})
#CORS(app, resources={r"/useradd": {"origins": "http://localhost:3000"}})
#cors = CORS(app, resources={r"*": {"origins": "http://127.0.0.1:5000/useradd"}})
# MySQL configuration


mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Koushika@1234',
    'database': 'project'
}

# Function to establish MySQL connection
def get_db_connection():
    return mysql.connector.connect(**mysql_config)



# Create a new user

# Get all users

@app.route('/api/listusers',methods =['GET'])
@cross_origin()
def listusers():
    connection = get_db_connection()
    cursor = connection.cursor()
    select_query = "SELECT * FROM pbst"
    cursor.execute(select_query)
    users = cursor.fetchall()
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in users:
        json_data.append(dict(zip(row_headers,result)))
   
    cursor.close()
    #print(users)
    
    return jsonify(json_data)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    connection = get_db_connection()
    cursor = connection.cursor()
    select_query = "SELECT * FROM logins where username=%s and password=%s and role = %s"
    cursor.execute(select_query,(username,password,role))
    
    user = cursor.fetchone()
    connection.commit()
    print(user)
    print(user[0])
    print(user[3])
    cursor.close()
    connection.close()

    if user:
            
        token_payload = {'username': user[0], 'role': user[3]}
        jwt_token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')
        return {'token': jwt_token, 'role': user[3]}
    else:
        return {'error': 'Invalid credentials'}, 401

@app.route('/api/useradd',methods=['POST'])
@cross_origin()
def useradd():
    connection = get_db_connection()
    cursor = connection.cursor()
    title = request.json.get('title')
    domain = request.json.get('domain')
    #category = request.json['category']
    #batchid = request.json.get('inputValue1')
    sec = request.json.get('section')
    category = request.json.get('category')
    batchno = request.json.get('batch')
    print(category)
    print(batchno)
    #batchid = int(batchid)
    insert_query = "INSERT INTO pbst (title,domain,category,section,batchno) VALUES (%s, %s,%s,%s,%s)"
    cursor.execute(insert_query, (title, domain,category,sec,batchno))
    
    update_query = "update batch set status='submitted' where batchid=%s and section=%s"
    cursor.execute(update_query,(batchno,sec))

    connection.commit()
    cursor.close()
    
    
    response = jsonify({"message": "User created"})
    
    return response


@app.route('/api/automate',methods=['POST'])
@cross_origin()
def AutomateBatchDividing():
    connection = get_db_connection()
    cursor = connection.cursor()
    grp_size = request.json.get('inputs')
    sec = request.json.get('inputs1')
    print(sec)
    grp_size = int(grp_size)
    #query = "SELECT studentid, cgpa FROM student where section = %s"
    query = "select s.studentid,s.cgpa from student s where s.studentid not in (select s.studentid from student s,batch b where s.batchno=b.batchid and b.batchtype = 'custom' and b.section=%s) and s.section = %s;"
    cursor.execute(query,(sec,sec,))

    
    users = cursor.fetchall()

    for i in users:
        upd = cursor.execute("update student set batchno = %s where studentid = %s",(0,i[0]))
        connection.commit()
        

    sorted_students = sorted(users, key=lambda x: x[1], reverse=True)
    #print(users)
    print(len(sorted_students))
    #print(sorted_students)
    
   
    #print(sorted_students)
    total_students = len(sorted_students)
    top_performers = sorted_students[:total_students // 3]  # Top 1/3 students
    average_performers = sorted_students[total_students // 3: 2 * (total_students // 3)]  # Middle 1/3 students
    poor_performers = sorted_students[2 * (total_students // 3):]  # Bottom 1/3 students
    toppers = top_performers[::-1]
    average = average_performers
    poor = poor_performers[::-1]
     
    print(toppers)
    print()
    print(average)
    print()
    print(poor)
    
    all_students = {
    'toppers': toppers.copy(),
    'average': average.copy(),
    'poor': poor.copy()
    }
    num_groups = grp_size
    groups = [[] for _ in range(num_groups)]
    remaining = sum(len(students) for students in all_students.values())
    all = remaining % num_groups
    print(remaining)
    print(all)
    while remaining > 3*num_groups:
        for group in groups:
            for category, students in all_students.items():
                if students:
                    student = students.pop()
                    group.append(student)
            
                    remaining -= 1
    # Ensure each group gets at least one student from each category
    '''
    for group in groups:
        for category, students in all_students.items():
        
            if students:
                student = students.pop()
                group.append(student)
    
    '''
    
    
    remaining_students = sum(len(students) for students in all_students.values())
    print()
    print("remain")
    print(remaining_students)
    remain_students = all_students
    #print(remain_students)
    re = []
    for category,st in enumerate(remain_students):
        re.append(remain_students[st])
    print(re)
    re1=[]
    for i in re:
        for j in i:
            re1.append(j)
    
    print('')
    print(re1)
    print('')
    sorted_remain = sorted(re1, key=lambda x: x[1], reverse=True)
    print(sorted_remain)
    print(num_groups)
    for i, student in enumerate(sorted_remain):
        group_index = (i % num_groups)
        print(group_index)
        groups[num_groups -1 - group_index].append(student)

# Print the groups
    print('')
    print(remaining_students)
    #print(groups)
    for i, group in enumerate(groups):
        print(f"Group {i + 1}: {group}")
    
    sec_up = sec.upper()
    del_batc = cursor.execute("delete from batch where batchtype <>'custom' and section = %s",(sec_up,))
    del_batches = len(cursor.fetchall())
    connection.commit()
    batc = cursor.execute("select batchid from batch where batchtype='custom' and section = %s",(sec,))
    batc = cursor.fetchall()
    batches = len(batc)
    connection.commit()
    batchno = []
    
    total_batchno = []

    for i in batc:
        batchno.append(i[0])
    #print(batc)
    print(batches)
    print(batchno)
    
    for i in range(grp_size + batches):
        if i+1 not in batchno:
            total_batchno.append(i+1)
    print(total_batchno)

    
    for i in range(len(groups)):
        #print(i)
        #print(len(json_data[i]))
        
        print(total_batchno[i])
        #print(groups[i][0][0])
        
        res = cursor.execute("insert into batch (batchid,batchleader,section,guidename,batchtype) values(%s,%s,%s,'dummy','automate')",(total_batchno[i],groups[i][0][0],sec,))
        connection.commit()

    for i in range(len(groups)):
        for j in groups[i]:
            #print(j[0])
            #print((i+1))
            cursor.execute("update student set batchno = %s where studentid = %s",(total_batchno[i],j[0]))
            connection.commit()

    
    connection.commit()
    cursor.close()
    return jsonify(batchno)
    
  

@app.route('/api/customcreate/',methods=['POST'])
@cross_origin()
def CustomDividing():
    if request.method == 'POST':
        connection = get_db_connection()
        cursor = connection.cursor()
        data = request.json  # Get the JSON data from the request
        selected_values = data.get('selectedValue',[])  
        sec = data.get('selectedOption1')
        guide = data.get('selectedOption')
        print(sec)
        selected_values = sorted(selected_values)
        print(f"sec is :{sec}")
        print(guide)
        print(f"selected:{selected_values}")
        #getdeta = cursor.execute("select s.studentid from student s,batch b where b.batchid=s.batchno and b.batchtype <> 'custom' and s.section =%s ",(sec,))
        getdeta = cursor.execute("select s.studentid,s.cgpa from student s where s.studentid not in (select s.studentid from student s,batch b where s.batchno=b.batchid and b.batchtype = 'custom' ) and s.section = %s;",(sec,))
        users = cursor.fetchall()
        print("users")
        print(users)
        connection.commit()
        
        for i in users:
            upd = cursor.execute("update student set batchno = %s where studentid = %s",(0,i[0]))
            connection.commit()
        

        del_batc = cursor.execute("delete from batch where batchtype <>'custom' and section = %s",(sec,))
        del_batches = len(cursor.fetchall())
        connection.commit()
        #print(selected_values)
        le = cursor.execute("select batchid from batch where section = %s",(sec,))
        
        batc = cursor.fetchall()
        batches = len(batc)
        connection.commit()
        print(batc)
        batchno = []
        total_batchno = []
        for i in batc:
            
            batchno.append(i[0])
    #print(batc)
        print(batches)
        print(batchno)

        for i in range(16):
           if i+1 not in batchno:
               total_batchno.append(i+1)
        print(total_batchno)
        cursor.execute("insert into batch(batchid,batchleader,section,batchtype,guidename) values(%s,%s,%s,'custom',%s)",(total_batchno[0],selected_values[0],sec,guide,))
        connection.commit()
        
        gui = cursor.execute("select guidename,batch_1,batch_2 from guide where guidename = %s",(guide,))
        guide_values = cursor.fetchall()
        print("guide values")
        print(guide_values)
        for i in guide_values:
            print(i)
            print(total_batchno[0])
            cursor.execute("update guide set batch_2 = %s where batch_1 !=0 and batch_2 = 0 and guidename=%s",(total_batchno[0],guide,))

            cursor.execute("update guide set batch_1 = %s where batch_1 = 0 and guidename = %s",(total_batchno[0],guide,))
            
        for i in selected_values:
            cursor.execute("update student set batchno=%s where studentid=%s",(total_batchno[0],i))
            connection.commit()

        
        cursor.close()
        
        #return jsonify({'message': 'Received selected values', 'selectedValues': selected_values})
        return jsonify({"message":"user"})


@app.route('/api/dropdown_values/<selected_value>',methods=['GET'])
@cross_origin()
def GetDropdown(selected_value):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    sec = selected_value.lower()
    select_query = "SELECT studentid FROM student where section = %s"
    cursor.execute(select_query,(sec,))
    users = cursor.fetchall()   
    connection.commit()
    cursor.close()
    print(users)
    #dropdown_values = [item.to_dict() for item in users]  # Assuming to_dict() method returns required data
    dat = []
    for i in users:
        print(i[0])
        dat.append(i[0])
    print(dat)
    return jsonify({"options":dat})
    

@app.route('/api/listcustombatch/<sec>',methods=['GET'])
@cross_origin()
def ListCustomBatch(sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    sec = sec.upper()
    select_query = "SELECT * FROM batch where batchtype='custom' and section = %s"
    cursor.execute(select_query,(sec,))
    users = cursor.fetchall()
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in users:
        json_data.append(dict(zip(row_headers,result)))
    connection.commit()
    cursor.close()
    #print(users)
    print(json_data)
    return jsonify(json_data)

@app.route('/api/listautomatebatch/<sec>',methods=['GET'])
@cross_origin()
def ListAutomateBatch(sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    sec = sec.upper()
    select_query = "SELECT * FROM batch where batchtype='automate' and section = %s order by batchid"
    cursor.execute(select_query,(sec,))
    users = cursor.fetchall()
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in users:
        json_data.append(dict(zip(row_headers,result)))
    connection.commit()
    cursor.close()
    #print(users)
    print(json_data)
    return jsonify(json_data)




@app.route('/api/listbatch/<sec>',methods=['GET'])
@cross_origin()
def BatchSection(sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    sec1 = sec.lower()
    #bat = request.json.get('section')
    select_query = "SELECT * FROM batch where section = %s or section = %s"
    cursor.execute(select_query,(sec,sec1))
    users = cursor.fetchall()   
    cursor.close()
    print(users)
    #dropdown_values = [item.to_dict() for item in users]  # Assuming to_dict() method returns required data
    dat = []
    for i in users:
        print(i[0])
        dat.append(i[0])
    print(dat)
    return jsonify(dat)

@app.route('/api/listguide/<sec>',methods=['GET'])
@cross_origin()
def GuideListing(sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    if sec == 'A' or sec == 'a':
        select_query = "SELECT guidename FROM guide where section_a is not null"
        cursor.execute(select_query)
        users = cursor.fetchall()   
    elif sec == 'B' or sec == 'b':
        select_query = "SELECT guidename FROM guide where section_b is not null"
        cursor.execute(select_query)
        users = cursor.fetchall()
    else:
        select_query = "SELECT guidename FROM guide where section_c is not null"
        cursor.execute(select_query)
        users = cursor.fetchall()

    cursor.close()
    print(users)
    #dropdown_values = [item.to_dict() for item in users]  # Assuming to_dict() method returns required data
    dat = []
    for i in users:
        print(i[0])
        dat.append(i[0])
    print(dat)
    return jsonify(users)


@app.route('/api/batch/<sect>/',methods=['GET'])
@cross_origin()
def Section(sect):
    connection = get_db_connection()
    if connection:
        print("Database connection established.")
    else:
        print("Failed to establish database connection.")
    cursor = connection.cursor()
    sect = sect.lower()
    #
    #select_query = "select b.batchid,s.studentid,concat(s.last_name,s.first_name) as full_name,s.phn from batch b,student s where s.batchno = b.batchid and b.section = %s order by 1;"
    #select_query ="select b.*,s.studentid,concat(s.last_name,s.first_name) as full_name,s.phn from (select b.batchid,p.title,b.guidename from batch b,pbst p where p.batchno=b.batchid and b.section = %s) b,student s where s.batchno = b.batchid  order by 1;"
    select_query = "select s.studentid,concat(s.first_name,last_name) as full_name,s.phn,b.batchid,b.guidename from student s,batch b where s.batchno=b.batchid and b.section=s.section and s.section=%s;"
    cursor.execute(select_query,(sect,))
    users = cursor.fetchall()   
    connection.commit()
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in users:
        json_data.append(dict(zip(row_headers,result)))
    
    select_query1 = "select p.title  from pbst p , batch b  where p.batchno = b.batchid and b.section = p.section and p.section = %s;"
    cursor.execute(select_query1,(sect,))
    users1 = cursor.fetchall()   
    connection.commit()
    
    
    print(users1)
    #dropdown_values = [item.to_dict() for item in users]  # Assuming to_dict() method returns required data
    
        
    row_headers1=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data1=[]
    for result in users1:
        json_data1.append(dict(zip(row_headers1,result)))
    final = []
    for item1, item2 in zip(json_data,json_data1):
        print(item1)
        print(item2)
        #item1 = tuple_item1[0]  # Assuming first element in the tuple is a dictionary
        #item2 = tuple_item2[0]  # Assuming first element in the tuple is a dictionary

        if isinstance(item1, dict) and isinstance(item2, dict):
            student_info = {
                "batchid": item1.get('batchid'),
                "full_name": item1.get('full_name'),
                "guidename": item1.get('guidename'),
                "phn": item1.get('phn'),
                "studentid": item1.get('studentid'),
                "title": item2.get('title')
            }

            final.append(student_info)
        
    cursor.close()
    #print(users)
    
    return jsonify({"Batches":json_data,"Problems":json_data1,"final":final})
    
@app.route('/api/reviewprojects/<sec>/',methods=['GET'])
@app.route('/api/reviewprojects/<sec>', methods=['GET'])
@cross_origin()
def get_review(sec):
    connection = get_db_connection()
    if connection:
        print("Database connection established.")
    else:
        print("Failed to establish database connection.")
    cursor = connection.cursor()
    sect = sec.lower()
    print(sec)
    #reviews = cursor.execute("select * from rev;")
    select_query = "SELECT reviewid,reviewdate,reviewlink FROM review where section=%s;"
    
    cursor.execute(select_query,(sec,))
    reviews=cursor.fetchall()
    print(reviews)
    '''
    print(reviews)
    connection.commit()
    
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in reviews:
        json_data.append(dict(zip(row_headers,result)))
    '''
    formatted_reviews = []
    for review in reviews:
        # Assuming the date is in the second column, modify accordingly
        date_string = review[1]  # Replace with the actual column index
        #date_object = datetime.strptime(date_string, "%a, %d %b %Y %H:%M:%S %Z")
        formatted_date = date_string.strftime("%A, %d %B %Y")
        #formatted_date = datetime.strptime(date_string, "%a, %d %b %Y %H:%M:%S %Z").strftime("%A, %d %B %Y")
        
        
        # Assuming other columns exist, modify accordingly
        formatted_review = {
            "reviewid": review[0],  # Replace with the actual column index
            "reviewdate": formatted_date,
            "reviewlink": review[2]  # Replace with the actual column index
            # Add more columns as needed
        }

        formatted_reviews.append(formatted_review)
    cursor.close()
    return jsonify(formatted_reviews)
    

@app.route('/api/batchdetails/<id>/<sec>/',methods=['GET'])

@cross_origin()
def Batch(id,sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    select_query = "SELECT * FROM batch b,student s  where b.batchid=s.batchno and b.batchid = %s and b.section=%s"
    cursor.execute(select_query,(id,sec,))
    users = cursor.fetchall()

    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in users:
        json_data.append(dict(zip(row_headers,result)))
   
    cursor.close()
    #print(users)
    print(json_data)
    return jsonify(json_data)


@app.route('/api/user/<id>/<sec>',methods=['GET'])
@cross_origin()
def GetProjectDetails(id,sec):
    print(f"Attempting to retrieve details for batchno: {id}")  # Check if route is being accessed
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        query = "SELECT * FROM pbst WHERE batchno = %s and section=%s"
        cursor.execute(query, (id,sec,))
        user = cursor.fetchall()
        connection.commit()
        cursor.close()
        if user:
            return jsonify(user)
        else:
            return jsonify({'message': 'No data found for this batchno'})
    else:
        return jsonify({'message': 'Database connection error'})


@app.route('/api/userupdate/<id>',methods=['PUT'])
@cross_origin()
def Projectadd(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    title = request.json['title']
    domain = request.json.get('domain')
    #category = request.json['category']
    #batchid = request.json.get('inputValue1')
    sec = request.json.get('section')
    category = request.json.get('category')
    
    print(category)
    
    #batchid = int(batchid)
    insert_query = "update pbst set title = %s,domain=%s,category=%s,section = %s where batchno = %s"
    cursor.execute(insert_query, (title, domain,category,sec,id))
    connection.commit()
    cursor.close()
    
    
    response = jsonify({"message": "User created"})
    
    return response

@app.route('/userdelete/<int:id>/<sec>',methods=['DELETE'])
@cross_origin()
def delete_project(id,sec):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    delete_query = "delete from pbst where batchno = %s and section=%s"
    cursor.execute(delete_query, (id,sec))
    connection.commit()
    cursor.close()
    
    return jsonify({"message":"success deleted"})



@app.route('/api/batchdelete/<id>',methods=['DELETE'])
@cross_origin()
def BatchDelete(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    getdeta = cursor.execute("select studentid from student where batchno = %s",(id,))
    users = cursor.fetchall()
    print(users)
    connection.commit()

    delete_query = "delete from batch where batchid = %s"
    cursor.execute(delete_query, (id,))
    connection.commit()

    for i in users:
        upd = cursor.execute("update student set batchno = %s where studentid = %s",(0,i[0]))
        connection.commit()
    cursor.close()
    
    return jsonify({"message":"success deleted"})



@app.route('/api/guidemapping/',methods=['POST'])
@cross_origin()
def guideMapping():
    connection = get_db_connection()
    cursor = connection.cursor()

    column_name = request.json['selectedOption1']
    print(column_name)
    #column_name = str(column_name)

    print(column_name)
    if column_name=='a':
        #cursor.execute("UPDATE guide SET  batch_1 = COALESCE((SELECT batchid FROM batch WHERE guidename = guide.guidename and section = guide.section_a AND batchtype = 'custom' LIMIT 1), 0),batch_2 = COALESCE((SELECT batchid FROM batch WHERE guidename = guide.guidename AND batchtype = 'custom' LIMIT 1 OFFSET 1), 0);")
        cursor.execute("UPDATE guide SET batch_1 = COALESCE((SELECT batchid FROM batch WHERE section='a' and guidename = guide.guidename AND batchtype = 'custom' LIMIT 1), 0),batch_2 = COALESCE((SELECT batchid FROM batch WHERE section='a' and guidename = guide.guidename  and  batchtype = 'custom' LIMIT 1 OFFSET 1), 0) WHERE guide.section_a IS NOT NULL;")

        
    elif column_name=='b':
        #cursor.execute("UPDATE guide SET  batch_1 = COALESCE((SELECT batchid FROM batch WHERE guidename = guide.guidename and section = guide.section_a AND batchtype = 'custom' LIMIT 1), 0),batch_2 = COALESCE((SELECT batchid FROM batch WHERE guidename = guide.guidename AND batchtype = 'custom' LIMIT 1 OFFSET 1), 0);")
        cursor.execute("UPDATE guide SET batch_1 = COALESCE((SELECT batchid FROM batch WHERE section='b' and guidename = guide.guidename AND batchtype = 'custom' LIMIT 1), 0),batch_2 = COALESCE((SELECT batchid FROM batch WHERE section='b' and guidename = guide.guidename  and  batchtype = 'custom' LIMIT 1 OFFSET 1), 0) WHERE guide.section_b IS NOT NULL;")

    else:
        cursor.execute("UPDATE guide SET batch_1 = COALESCE((SELECT batchid FROM batch WHERE section='c' and guidename = guide.guidename AND batchtype = 'custom' LIMIT 1), 0),batch_2 = COALESCE((SELECT batchid FROM batch WHERE section='c' and guidename = guide.guidename  and  batchtype = 'custom' LIMIT 1 OFFSET 1), 0) WHERE guide.section_c IS NOT NULL;")

    connection.commit()
    
    #batch_query = cursor.execute("select batchno,domain from pbst where section = %s;",(column_name,))
    batch_query = cursor.execute("select b.batchid,p.domain from pbst p,batch b where p.batchno=b.batchid and p.section=b.section and p.section = %s and b.guidename='dummy';",(column_name,))
    batch = cursor.fetchall()
    connection.commit()
    
    print(batch)
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in batch:
        json_data.append(dict(zip(row_headers,result)))

    print(json_data)
    
    
    json_data1=[]
    if column_name == 'a':
        if column_name:
            query = f"select guidename,domains from guide where section_a is not null"
            guide_query = cursor.execute(query)
            guide = cursor.fetchall()
            connection.commit()
            row_headers1=[x[0] for x in cursor.description] #this will extract row headers
            for result in guide:
                json_data1.append(dict(zip(row_headers1,result)))
                
            batches = json_data
            guides = json_data1
            print(batches)
            print("")
            print(guides)
            avail = cursor.execute(" select guidename , case when batch_1 =0 and batch_2 =0 then 2 when batch_1=0 or batch_2 =0 then 1 else 0  end as cnt from guide where section_a is not null group by guidename;")
            avail_guides = cursor.fetchall()
            connection.commit()
            ava = dict(avail_guides)
    elif column_name == 'b':
        if column_name:
            query = f"select guidename,domains from guide where section_b is not null"
            guide_query = cursor.execute(query)
            guide = cursor.fetchall()
            connection.commit()
            row_headers1=[x[0] for x in cursor.description] #this will extract row headers
            for result in guide:
                json_data1.append(dict(zip(row_headers1,result)))
                
            batches = json_data
            guides = json_data1
            print(batches)
            print("")
            print(guides)
            avail = cursor.execute(" select guidename , case when batch_1 =0 and batch_2 =0 then 2 when batch_1=0 or batch_2 =0 then 1 else 0  end as cnt from guide where section_b is not null group by guidename;")
            avail_guides = cursor.fetchall()
            connection.commit()
            ava = dict(avail_guides)
    else:
        if column_name:
            query = f"select guidename,domains from guide where section_c is not null"
            guide_query = cursor.execute(query)
            guide = cursor.fetchall()
            connection.commit()
            row_headers1=[x[0] for x in cursor.description] #this will extract row headers
            for result in guide:
                json_data1.append(dict(zip(row_headers1,result)))
                
                
            batches = json_data
            guides = json_data1
            print(batches)
            print("")
            print(guides)
            avail = cursor.execute(" select guidename , case when batch_1 =0 and batch_2 =0 then 2 when batch_1=0 or batch_2 =0 then 1 else 0  end as cnt from guide where section_c is not null group by guidename;")
            avail_guides = cursor.fetchall()
            connection.commit()
            ava = dict(avail_guides)
    for guide in json_data1:
            guide["domains"] = json.loads(guide["domains"])
            
    
    
    print(ava)
    guide_batches = defaultdict(list)
    allocated_batches = set()
    
    for guide in guides:
        for domain in guide['domains']:
            for batch in batches:
                if batch['domain'] == domain and batch['batchid'] not in allocated_batches:
                    if ava[guide['guidename']] > 1 :
                        ava[guide['guidename']] -=1
                        guide_batches[guide['guidename']].append(batch['batchid'])
                        allocated_batches.add(batch['batchid'])
                        break
                    
    print("")
    print(ava)
    print()
    print(allocated_batches)
    
    print(guide_batches)
    
    def sort(dic):
        sorted_x = sorted(dic.items(), key=lambda kv: kv[1] ,reverse = True)
        sorted_di = dict(sorted_x)
        return sorted_di
    #print(sorted_x)
    sorted_dict = sort(ava)
    #print(sorted_dict)
    
    unallocated_batches = [batch['batchid'] for batch in batches if batch['batchid'] not in allocated_batches]
    print(unallocated_batches)
    
    for batch_id in unallocated_batches:
        sorted_ = sort(sorted_dict)
    
        for guide in sorted_:
        
        #print(sorted_dict[guide] , batch_id)
            if sorted_dict[guide] > 0 :
                sorted_dict[guide] -=1
                guide_batches[guide].append(batch_id)
                allocated_batches.add(batch_id)
                break
            
    for guide in guides:
        guide_name = guide['guidename']
        assigned_batches = guide_batches.get(guide_name, [])
        print(f"Guide: {guide_name}, Assigned Batches: {assigned_batches}")
    
    for guide in guide_batches:
        print(guide)
        assigned = guide_batches.get(guide, [])
        for i in assigned:
            print(f"Guide:{guide},Batch:{i}")
            upd_batc = cursor.execute("update batch set guidename=%s where batchid = %s and section=%s",(guide,i,column_name,))
            cursor.execute("update guide set batch_2 = %s where batch_1 !=0 and batch_2 = 0 and guidename=%s",(i,guide,))

            cursor.execute("update guide set batch_1 = %s where batch_1 = 0 and guidename = %s",(i,guide,))
            
    
    connection.commit()
            
    
    
    cursor.close()
    
    return jsonify({"Batches":batches,"Guides":guides})
    #return jsonify("sucess")



@app.route('/api/group/',methods=['GET'])
@cross_origin()
def group():
    connection = get_db_connection()
    cur = connection.cursor()
    cur.execute("select studentid,cgpa from student where section='b'")
    user = cur.fetchall()
    print(user)
    connection.commit()
    cur.close()
    return jsonify(user)




    
@app.route('/api/review_sch/', methods=['POST'])
@cross_origin()
def save_date():
    data = request.get_json() # Assuming the date is sent as a JSON object
    review_no = data.get('reviewno')
    date = data.get('date')    # Extracting the date from the JSON data
    url = data.get('url')
    sec = data.get('sec')
    #review_no = int(review_no)
    #sec = sec.lower()
    print(review_no)
    print(date)
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        # Inserting the date into the database
        cur.execute("INSERT INTO review (reviewid,reviewdate,reviewlink,section) VALUES (%s,%s,%s,%s)", (review_no,date,url,sec,))
        connection.commit()
        cur.close()
        return jsonify({'message': 'Date inserted successfully'})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

@app.route('/api/review-numbers/',methods=['GET'])
@cross_origin()
def get_review_numbers():
    # Replace this with your logic to fetch the review numbers
    
    connection = get_db_connection()
    cur = connection.cursor()
    cur.execute("select distinct reviewid from review")
    review_numbers = cur.fetchall()
    connection.commit()
    batch_numbers = [row[0] for row in review_numbers]
    cur.close()
    connection.close()
    
    # Return the review numbers as JSON
    return jsonify(batch_numbers)

def model(scores):
    df = pd.read_csv('synthetic_dataset.csv')
    data = df
    print(data.columns)  # Print the columns for inspection

    # Use all columns except 'id', 'title', 'description', 'status', and 'Overall Score'
    X = data.drop(['id','status', 'Overall Score'], axis=1)
    y = data['Overall Score']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = sqrt(mean_squared_error(y_test, y_pred))
    print(f"Root Mean Squared Error on Test Data: {rmse}")
    '''
    scores = {
        'Creativity': int(input("Rate 'Creativity' (1-5): ")),
        'Technical Skills': int(input("Rate 'Technical Skills' (1-5): ")),
        'Project Management': int(input("Rate 'Project Management' (1-5): ")),
        'Documentation': int(input("Rate 'Documentation' (1-5): ")),
        'Presentation': int(input("Rate 'Presentation' (1-5): "))
    }'''

    input_data = [[scores['creativity'], scores['technicalskills'],
                   scores['projectmanagement'], scores['documentation'], scores['presentation']]]

    overall_score = model.predict(input_data)[0]
    print(f"Predicted Overall Score: {overall_score:.2f}")
    return overall_score




@app.route('/api/submit-form', methods=['POST'])
@cross_origin()
def submit_form():
    conn = get_db_connection()
    cursor = conn.cursor()
    data = request.json
    batchno = data.get('batchNo')
    sec = data.get('sec')
    reviewno = data.get('selectedReviewNumber')
    role = data.get('role')
    print(role)
    print(reviewno)
    print(batchno)
    print(sec)

    # Assuming your MySQL table is named 'students'
    
    
    
    query = "insert into rev (section,batchno,creativity,presentation,name,technicalskills,projectmanagement,documentation,Overall,role,reviewno) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    
    cr = []
    tech=[]
    prmng=[]
    docm = []
    pr = []
    for student in data['students']:
        
        values = (sec,batchno,student['creativity'], student['presentation'], student['name'],student['technicalskills'],student['projectmanagement'],student['documentation'])
        cr.append(int(student['creativity']))
        tech.append(int(student['technicalskills']))
        prmng.append(int(student['projectmanagement']))
        docm.append(int(student['documentation']))
        pr.append(int(student['presentation']))
        
        scores={'creativity': int(student['creativity']),
        'technicalskills':int(student['technicalskills']),
        'projectmanagement':int(student['projectmanagement']),
        'documentation': int(student['documentation']),
        'presentation': int(student['presentation'])}
        ov_sc_st = model(scores)
        print(ov_sc_st)
        values = values+(ov_sc_st,)
        values = values+(role,)
        values=values+(reviewno,)
        cursor.execute(query, values)
        
    scores={
        'creativity': mean(cr),
        'technicalskills':mean(tech) ,
        'projectmanagement': mean(prmng),
        'documentation': mean(docm),
        'presentation': mean(pr)
    }
    
    print(scores)
    
    ov_sc_bt = model(scores)
    print(ov_sc_bt)
    #cursor.execute("update batch set  review_score=%s where  batchid=%s and section=%s",(ov_sc_bt,batchno,sec))
    
    print(cr)
    print(tech)
    print(prmng)
    print(docm)
    print(pr)
    conn.commit()
    
    
    cursor.close()
    conn.close()
    return jsonify({'message': 'Data stored successfully'})

# New Flask route to get student data
@app.route('/api/get-students', methods=['GET'])
@cross_origin()
def get_students():
    # Assuming your MySQL table is named 'students'
    conn = get_db_connection()
    cursor = conn.cursor()
    
    batchno = request.args.get('batchno', '')
    sec = request.args.get('sec', '')
    cursor = conn.cursor()
    # Assuming your MySQL table is named 'students'
    query = "SELECT studentid FROM student WHERE batchno = %s AND section = %s"
    
    cursor.execute(query, (batchno, sec,))
    result = cursor.fetchall()
    conn.commit()

    students = [{'name': row[0]} for row in result]
    
    cursor.close()
    conn.close()
    return jsonify({'students': students})

@app.route('/api/get-batch-numbers', methods=['GET'])
@cross_origin()
def get_batch_numbers_faculty():
    # Assuming your MySQL table is named 'students' and contains a 'batchno' column
    conn = get_db_connection()
    cursor = conn.cursor()
    sec = request.args.get('sec', '')
    query = "SELECT DISTINCT batchno FROM student where section=%s"

    cursor.execute(query,(sec,))
    result = cursor.fetchall()
    conn.commit()
    batch_numbers = [row[0] for row in result]
    cursor.close()
    conn.close()

    return jsonify({'batch_numbers': sorted(batch_numbers)})

@app.route('/api/get-batch-numbers-faculty', methods=['GET'])
@cross_origin()
def get_batch_numbers():
    # Assuming your MySQL table is named 'students' and contains a 'batchno' column
    conn = get_db_connection()
    cursor = conn.cursor()
    guide = request.args.get('guide')
    sec = request.args.get('sec', '')
    print(guide)
    query = "SELECT DISTINCT batchid FROM batch where section=%s and guidename=%s"

    cursor.execute(query,(sec,guide))
    result = cursor.fetchall()
    conn.commit()
    batch_numbers = [row[0] for row in result]
    cursor.close()
    conn.close()

    return jsonify({'batch_numbers': sorted(batch_numbers)})

@app.route('/api/get-guide', methods=['GET'])
@cross_origin()
def get_guide():
    user_role = request.args.get('role')
    username = request.args.get('username')
    password=request.args.get('password')

    # You can replace this logic with your own to determine the guide based on the user's role
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("select name from logins where role=%s and username=%s and password = %s",(user_role,username,password))
    res = cursor.fetchall()
    
    return jsonify(res[0])

@app.route('/top-rank-students',methods=['GET'])
@cross_origin()
def get_top_rank_students():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("select s.studentid from student s,(select * from batch order by review_score desc limit 3)b where s.batchno=b.batchid and s.section=b.section;")
    res = cursor.fetchall()
    res = [row[0] for row in res]
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"top_rank_students":res}), 200



def get_student_data(student):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    #cursor.execute("select s.studentid,s.batchno,b.review_score from student s,( select * from batch order by review_score desc limit 3) b where b.batchid = s.batchno and b.section=s.section and s.studentid=%s;",(student,))
    cursor.execute("select s.studentid,s.batchno,b.review_score,b.rank from student s,(select *,ROW_NUMBER() OVER(order by review_score desc) as 'rank' from batch limit 3) b where b.batchid = s.batchno and b.section=s.section and s.studentid=%s",(student,))
    students = cursor.fetchall()
    print(students)
    row_headers=[x[0] for x in cursor.description] #this will extract row headers
    
    json_data=[]
    for result in students:
        json_data.append(dict(zip(row_headers,result)))
    print(json_data)
    return json_data
    

def generate_certificate(student_data, output_path):
    # Create a PDF canvas
    pdf_canvas = canvas.Canvas(output_path, pagesize=letter)
    background_color=(0.9607843137254902, 0.9607843137254902, 0.8627450980392157)
    pdf_canvas.setFillColorRGB(*background_color)
    # Set up certificate design
    pdf_canvas.setStrokeColorRGB(0.7215686274509804, 0.5254901960784314, 0.043137254901960784)  # Black color for borders
    pdf_canvas.setLineWidth(1)
    # Draw borders
    pdf_canvas.rect(47, 46, 506, 708)
    pdf_canvas.setStrokeColorRGB(0.7215686274509804, 0.5254901960784314, 0.043137254901960784)  # Black color for borders
    pdf_canvas.setLineWidth(1)
    # Draw borders
    pdf_canvas.rect(50, 50, 500, 700)
    
  

    # Write content to the certificate
    pdf_canvas.setFont("Helvetica", 30)
    color = (0.8549, 0.6471, 0.1255)
    pdf_canvas.setFillColorRGB(*color)
    pdf_canvas.drawString(120, 630, f"Certificate Of Achievement")
    pdf_canvas.setFont("Helvetica", 15)
    color = (0, 0, 0)
    pdf_canvas.setFillColorRGB(*color)
    pdf_canvas.drawString(165, 570, f"This Certificate is Proudly Presented to  ")
    color = (0, 0, 1)
    pdf_canvas.setFillColorRGB(*color)
    pdf_canvas.setFont("Times-Italic", 30)
    pdf_canvas.drawString(150, 530, f"{student_data['Student Name']}")
    color = (0, 0, 0)
    pdf_canvas.setFillColorRGB(*color)
    pdf_canvas.setFont("Helvetica", 12)
    pdf_canvas.drawString(80, 500, f"This Certificate is given to {student_data['Student Name']} Of batch {student_data['Batch No']} for her top performance")
    pdf_canvas.drawString(80, 485,f"by  securing  {student_data['Rank']} rank   ")
    # pdf_canvas.drawString(80, 470,f"  in computer science and engineering")

    # Save the PDF
    pdf_canvas.save()
    
    
@app.route('/generate-certificate', methods=['POST'])
@cross_origin()
def generate():
    username = request.json.get('username')
    print(username)
    user1 = get_student_data(username)
    print(user1)
    
    user = user1[0]
    print(user)
    
    student_data = {
        'Batch No':user['batchno'],
        'Student Name':user['studentid'],
        'Marks':user['review_score'],
        'Rank':user['rank']
        
    }
    print(student_data)
    output_path = f"certificate_batch{student_data['Batch No']}_{student_data['Student Name']}.pdf"
    generate_certificate(student_data, output_path)
    #return send_file(output_path, as_attachment=True)
    #return "success"
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    
    app.run(debug=True)
    
