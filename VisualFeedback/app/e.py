
import requests

URL = 'https://bigfive-test.com/ja/result/58a70606a835c400c8b38e84'
headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"} 
# Here the user agent is for Edge browser on windows 10. You can find your browser user agent from the above given link. 
response = requests.get(url=URL, headers=headers) 
print(response.content)

from bs4 import BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')
print(soup.title)