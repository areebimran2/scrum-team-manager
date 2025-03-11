import requests
import json

def make_post_request(url, data, cookies):
    try:
        headers = {'Content-Type' : 'application/json'}

        response = requests.post(url, json=data, headers=headers, cookies=cookies)
        if response.status_code != 200 and response.status_code != 201:
            print(f"POST request did not work: {response.status_code}")
            print("Response: ", response.text)
            raise ConnectionError("A post request did not work!!!")
        return response
    except Exception as e:
        print(e)
        
def read_json(file_path):
    try:
        # Open the JSON file
        with open(file_path, 'r') as file:
            # Load the JSON data
            test_cases = json.load(file)
            return test_cases

    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        exit()
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{file_path}'.")
        exit()
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        exit()

if __name__ == "__main__":
    file_path = "Prefill/fill_workload.json"
    test_cases = read_json(file_path)

    url = 'http://127.0.0.1:10001'

    cookie_dict = {}
    uid_counter = 1

    for test in test_cases:
        print(f"Task: {test}")
        case = test_cases[test]

        if case["cookie_id"] is None or case["cookie_id"] == -1:
            cookies = None
        else:
            cookies = cookie_dict[case["cookie_id"]]

        if case['method'] == "POST":
            print(f"Data: {case["data"]}")
            res = make_post_request(url + case["URI"], case["data"], cookies)
            if case["cookie_id"] == -1:
                cookie_dict[uid_counter] = res.cookies
                uid_counter += 1
        elif case["method"] == "POST query":
            print(f"Data: {case["data"]}")
            make_post_request(url + case["URI1"] + f"{case["key"]}" + case["URI2"], case["data"], cookies)

        print()