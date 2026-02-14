import pandas as pd
#loads data
df = pd.read_csv("FOIA_COURSES.csv")

#keeps necessary columns
kept_cols = ['Term', 'Year', 'Subject', 'Course Number',
             'Title', 'Instructor', 'A+', 'A', 'A-',
             'B+', 'B', 'B-', 'C+', 'C', 'C-',
             'D', 'F', 'W', 'Total_Students']

df_clean = df[kept_cols].copy()

df_clean['Fail_Rate'] = (df_clean['F'] / df_clean['Total_Students']) * 100


#Identify "Gatekeeper" Outliers (40+% fail-rate)
gatekeepers = df_clean[df_clean['Fail_Rate'] > 40].copy()

#limits to latest 5 years (2021-2026)
df_recent = df_clean[df_clean['Year'] >= 2021].copy()
df_recent.to_json('cleaned_grades.json', orient='records')

#Finds those "perfect" classes
#df['A_Rate'] = ((df['A+'] + df['A']) / df['Total_Students']) * 100
#easy_As = df[(df['A_Rate'] > 90) & (df['Total_Students'] > 10)]

print("--- Potential 'Gatekeeper' Courses (High Fail Rate) ---")
if not gatekeepers.empty:
    print(gatekeepers[['Subject', 'Course Number', 'Instructor', 'Fail_Rate']].head())
else:
    print("No courses found with >40% failure rate.")

print("\nSuccess")