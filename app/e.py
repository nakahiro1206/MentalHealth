
import requests, re

URL = 'https://bigfive-test.com/da/result/58a70606a835c400c8b38e84'
headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"} 
# Here the user agent is for Edge browser on windows 10. You can find your browser user agent from the above given link. 
response = requests.get(url=URL, headers=headers)

from bs4 import BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

subheadings = soup.find_all(class_="subheading")
assert len(subheadings) == 35;
neuroticism = re.sub(r"\D", "", subheadings[0].get_text())
extraversion = re.sub(r"\D", "", subheadings[7].get_text())
openess2experience = re.sub(r"\D", "", subheadings[14].get_text())
agreeableness = re.sub(r"\D", "", subheadings[21].get_text())
conscientiousness = re.sub(r"\D", "", subheadings[28].get_text())
print(neuroticism, extraversion, openess2experience, agreeableness, conscientiousness)