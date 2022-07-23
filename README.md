# Detecting-Malicious-Javascript

This is my final year project. The purpose of this project was to study the effectiveness of Machine Learning models trained on Abstract Syntax Tree (AST)-based features for the task of detecting malicious obfuscated JavaScript. To achieve this, I built a static classification pipeline which can be broken down into the following components:

1.	Gathering data: I built a WebCrawler in Python using the Scrapy framework to acquire benign samples of JavaScript. The final dataset consisted of over 36,000 samples (benign and malicious) 
2.	Preparing the data: I used a script written in JavaScript (Node.js) to perform Static Analysis on the AST of the samples. This script extracted the relevant features to build a dataset.
3.	Dataset Preparation:  In a Jupyter Notebook Environment, I used Python to combine the benign and malicious samples of JavaScript into a dataset for the models
4.	Learning and Classification: The Support Vector Machine, Decision Trees, and Random Forest models were implemented using scikit-learn 

In conclusion, Random Forest outperformed all other models with an average accuracy of Precision, Sensitivity and Specificity scores of 98.66%,
98.34% and 98.69%. (Thesis available upon request)
