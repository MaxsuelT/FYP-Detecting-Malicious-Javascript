import sys
import pandas as pd
import numpy as np
import os

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold

from sklearn.utils import shuffle
import warnings
warnings.filterwarnings('error')




filepath = os.path.join(os.getcwd(), "../data/Interim_Report.csv")
df = pd.read_csv(filepath)
df['Class'] = df['Class'].apply(lambda val: 0 if val == 'Benign' else 1)
df = shuffle(df, random_state = 1)

X = df.drop('Class', axis=1)
y = df.loc[:,'Class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4,
random_state=1, stratify=y)

rf = RandomForestClassifier(
    n_estimators= 50,
    criterion="gini", 
    max_depth= 6, 
    max_leaf_nodes= 8,
    min_samples_split = 20,
    bootstrap=True, 
    max_features="sqrt",
    random_state=1
) 

rf.fit(X_train, X_test)

args = sys.argv
print(f'Analyzing the file at the path: {args[1]}')

y_pred = rf.predict(args[1])

for val in y_pred:
    if(val == 0):
        print("File benign dont worry")
    else:
        print('This file could potentially be dangerous!')
