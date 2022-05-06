import os
from random import sample, seed, randint

# get the same output everytime
# seed(90)


# * Reading files from a directory
# reading a single file
reading_path = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_1-Data_Collection/js_files/'
# reading_path = os.path.join(os.getcwd(), 'samples/benign_samples/')
# print(reading_path)
# 1. Selecting files at random to minimize chance of duplicates
def list_files():
    # ignoring hidden files
    list_dir = [
        file for file in os.listdir(reading_path)
        if not file.startswith('.')
        ] 
    return list_dir

def sampling(file):
    return sample(file,
        # [line for line in file if len(line) > 100],
         min(len(file), randint(15,30)))


# def clean_file(file):
#     return [
#         line.strip().lower() 
#         for line in file if any(line.strip())
#     ]


def data():
    samples_dict = {}
    for filename in list_files():
        filepath = reading_path + filename
        with open(filepath, 'r') as reader:
            try:
                samples_dict[filename]= sampling(reader.readlines())
            except ValueError as e:
                print(e)
                pass
    
    return samples_dict



# 4. Creating Files
saving_path = os.path.join(os.getcwd() , 'samples/experiment/')
# print(len(os.listdir(saving_path)) > 7500)
samples_dict = data()
for key,value in samples_dict.items():
    if(len(os.listdir(saving_path)) >= 7700):
        break

    for idx, val in enumerate(value):
        filename = saving_path + key.split('.')[1] + str(idx) + '.js'
        # print(f'Index: {idx} => {val} \n')
        if not os.path.isfile(filename):
            with open(filename, mode='a+') as file:
                file.write(val)
        
