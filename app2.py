import random
import pandas as pd



# Generate a synthetic dataset with 100 rows
projects = []
for project_id in range(1, 501):
    project = {
        "id": project_id,
        
        "status": "Reviewed",
        "Creativity": random.randint(1, 5),
        "Technical Skills": random.randint(1, 5),
        "Project Management": random.randint(1, 5),
        "Documentation": random.randint(1, 5),
        "Presentation": random.randint(1, 5),
        "Overall Score": 0  # Placeholder for the overall score
    }
    projects.append(project)

# Calculate the overall score based on the random scores
for project in projects:
    scores = [
        project['Creativity'],
        project['Technical Skills'],
        project['Project Management'],
        project['Documentation'],
        project['Presentation']
    ]
    overall_score = (sum(scores) / len(scores)) *2
    project['Overall Score'] = overall_score

# Store the synthetic dataset in a pandas DataFrame
df = pd.DataFrame(projects)

# Display the first few rows of the DataFrame
print(df.head())

# Save the DataFrame to a CSV file
df.to_csv('synthetic_dataset.csv', index=False)
