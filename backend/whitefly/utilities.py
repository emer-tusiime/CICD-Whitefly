import os.path
import datetime
import requests
import cv2
import io
from PIL import Image
import numpy as np
import csv

url_single = "http://localhost:5000/post_single_file/"
url_multi = "http://localhost:5000/multi_file_async/"


def post_image(file_list=None, end_point=url_multi):
    try:
        r = requests.post(url=end_point, files=file_list)
        if r.status_code == 200:
            return r.json()
        print(r.status_code)
        return "Failed to fetch results"
    except Exception as e:
        print(e)


def post_single_image(image_data, end_point=url_single):
    files = {'file': image_data}
    try:
        r = requests.post(url=end_point, files=files)
        if r.status_code == 200:
            return r.json()
        print(r.status_code)
        return "Failed to fetch results"
    except Exception as e:
        print(e)


def draw_annotations(img_data, detections):
    # Load image and make it writable (copy to avoid read-only array)
    img = np.array(Image.open(io.BytesIO(img_data)))
    # Convert RGB to BGR for OpenCV
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    print(detections)
    for d in detections:

        # # print("Type of d:", type(detections)) 
        # # print("Type of d:", type(d))  # Check the type of each element in 'detections'
        # # print(d['xmin'])
        # # # Optional: Print the content of each 'd' element
        # # print("Content of d:", d)

        # cv2.rectangle(
        #     img,
        #     (int(d['xmin']), int(d['ymin'])),
        #     (int(d['xmax']), int(d['ymax'])),
        #     (255, 0, 0),
        #     2
        # ) 


        index = int(list(d.keys())[0])  # Extract the index from the dictionary key
        coordinates = d[str(index)]  # Access the coordinates using the string index

        # Accessing the coordinates using the string index
        xmin = coordinates['xmin']
        ymin = coordinates['ymin']
        xmax = coordinates['xmax']
        ymax = coordinates['ymax']

        cv2.rectangle(
            img,
            (int(xmin), int(ymin)),
            (int(xmax), int(ymax)),
            (255, 0, 0),
            2
        )

    return img


def save_img(img_arr, path_to_save):
    # Image is already in BGR format from draw_annotations, so save directly
    return cv2.imwrite(path_to_save, img_arr)


def save_results(image_name, num_detections, csv_path):
    if os.path.exists(csv_path):
        with open(csv_path, "a", newline="") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow([datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"), image_name, num_detections])
            print("Updated Results")
    else:
        with open(csv_path, "w", newline="") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(["Date", "Image Name", "Whitefly Count"])
            csv_writer.writerow([datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"), image_name, num_detections])
            print("Created CSV and Updated Results")
