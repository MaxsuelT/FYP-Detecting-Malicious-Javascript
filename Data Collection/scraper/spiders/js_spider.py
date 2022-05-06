import os
import json
from urllib.parse import urlparse
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.exceptions import CloseSpider
# from scraper.items import JsSpiderItems
from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import DNSLookupError
from twisted.internet.error import TimeoutError, TCPTimedOutError


class jsSpider(CrawlSpider):
    """
        Goal: 
            - Acquire benign samples of JavaScript
        
        Task:
            - Download external JavaScript files from Alexa's Top 1
              Million Websites

        Action:
            
            1. Crawl every website in a list of web addresses
            2. For every webpage
                links that are in the src attribute of script tags 
            3. Add the links to a queue
            4. Crawl the links
            5. Download the page (JS file)
            6. Repeat steps 1,2,3,4,5 
                until there are not pages left to crawl
    """

    name= 'js_spider'

    def __init__(self):
        super(jsSpider, self).__init__()
        # top1 million websites
        self.allowed_domains = self.getJson('utils/top1msites_domains.json')[200000:]
        self.start_urls = self.getJson('utils/top1msites_urls.json')[200000:]
        
       
    rules = (
        Rule(LinkExtractor(
            tags= ('script'),
            attrs=('src')
        ), 
        callback='parseScript',
        errback='errback_'
        ),
    )

    
    def parseScript(self, response):
        path = os.path.join(
            os.getcwd(), 'benign_samples/benign_scripts_10/')
        filename = path + self.get_filename(response.url)

        if (len(self.list_files()) >= 25000):
            raise CloseSpider('Stop right there')
        elif(len(response.body) < 1000 or len(response.body) > 100000):
            print(len(response.body))
            pass
        else:
            if not os.path.exists(filename):
                with open(filename, 'wb') as fobj:
                    fobj.write(response.body)
                    print(f'filename - {filename} saved!')



    def writeToFile(self, filename, data):
        try:
            with open(filename, 'a+') as f:
                f.writelines(data)
        except OSError:
            print(f'OSError {OSError.strerror}')
            pass
        
        return f'filename - {filename} saved!'
    


    def get_filename(self, url):
        """
            Parsing the urls
        """
        extension = ''
        if not url.endswith('.js'):
            extension = '.js'

        parsed_url = urlparse(url)
        return ('|'.join(f'{parsed_url.netloc}{parsed_url.path}{extension}'
                .split('/')))



    def getJson(self, path):
        """
            Get the data to be used by the start_urls and domains    
        
        """
        filename = os.path.join(os.getcwd(),path)
        with open(filename, 'r') as fileobj:
            data = json.load(fileobj)
        return data

    def list_files(self):
    # ignoring hidden files
        path = os.path.join(
            os.getcwd(), 'benign_samples/benign_scripts_10/')
        list_dir = [
            file for file in os.listdir(path)
            if not file.startswith('.')
            ] 
        return list_dir



    def errback_(self, failure):

      if failure.check(HttpError):
        response = failure
        code = failure
        reason = failure
        print(f'''HttpErrorcode {code} on {response}
              for the following reason: {reason}''')
        pass
      
      elif failure.check(DNSLookupError):
        request = failure
        print(f'DNSLookupError on {request}')
        pass

      elif failure.check(TimeoutError, TCPTimedOutError):
        request = failure.request
        print(f'TimeoutError {request}')
        pass
    
    
