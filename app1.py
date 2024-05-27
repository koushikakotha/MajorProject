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
    query = "select s.studentid,s.cgpa from student s where s.studentid not in (select s.studentid from student s,batch b where s.batchno=b.batchid and b.batchtype = 'custom' ) and s.section = %s;"
    cursor.execute(query,(sec,))

    
    users = cursor.fetchall()

    for i in users:
        upd = cursor.execute("update student set batchno = %s where studentid = %s",(0,i[0]))
        connection.commit()
        

    sorted_students = sorted(users, key=lambda x: x[1], reverse=True)
    #print(users)

    print(sorted_students)
    
    '''
    num_groups = grp_size
    groups = [[] for _ in range(grp_size)]

    # Distribute students to groups, trying to maintain highest, middle, and lowest CGPAs in each group
    for i, student in enumerate(sorted_students):
        group_index = i % num_groups
        groups[group_index].append(student)

    print(groups)
    print(len(groups))
    
    for i, team in enumerate(groups, start=1):
        print(f"Team {i}:")
        for student in team:
            print(f" - {student[0]} (CGPA: {student[1]})")
        print()
    '''
    print(sorted_students)
    total_students = len(sorted_students)
    top_performers = sorted_students[:total_students // 3]  # Top 1/3 students
    average_performers = sorted_students[total_students // 3: 2 * (total_students // 3)]  # Middle 1/3 students
    poor_performers = sorted_students[2 * (total_students // 3):]  # Bottom 1/3 students
    toppers = top_performers[::-1]
    average = average_performers
    poor = poor_performers[::-1]
    all_students = {
    'toppers': toppers.copy(),
    'average': average.copy(),
    'poor': poor.copy()
    }
    #print(toppers)
    #print('')
    #print(average)
    #print('')
    #print(poor)
    
    num_groups = grp_size
    groups = [[] for _ in range(num_groups)]
    # Ensure each group gets at least one student from each category
    for group in groups:
        for category, students in all_students.items():
        
            if students:
                student = students.pop()
                group.append(student)
    print('')
    print(groups)

    remaining_students = sum(len(students) for students in all_students.values())
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
    
    '''
    while remaining_students > 0:
        for group in groups:
            if remaining_students == 0:
                break
            non_empty_categories = [category for category, students in all_students.items() if students]
            if non_empty_categories:
                chosen_category = random.choice(non_empty_categories)
                group.append(all_students[chosen_category].pop())
                remaining_students -= 1
                '''
# Print the groups
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