import os
import pickle
import scrapy
from urllib.parse import urlparse, urljoin
import csv
from scraper.items import topSites

from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import DNSLookupError
from twisted.internet.error import TimeoutError, TCPTimedOutError
from scrapy.exceptions import CloseSpider

class urlSpider(scrapy.Spider):
    """
        Goals:
        1. Grab alexa's top site names by country
        2. Create folder
        4. Return a list of names
    """
    name = "url_spider"
    
    allowed_domains = [
      'phishtank.org'
    ]

    start_urls = [
      "https://phishtank.org/phish_search.php?page=0&active=y&valid=y&Search=Search"
        
    ]

    def parse(self, response):
      """
        Default callback to process the responses.
        The parse method is in charge of processing the 
        response and returning scraped data and/or more URLs
         to follow.
      """
      # 2
      all_links = response.css("a::attr(href)").getall()
      links_filtered = [
        link for link in all_links 
        if '?page=' in link or 'phish_id' in link
      ]
      urls = []

      #  4.
      res_url = urlparse(response.url)
      # 5.
      for link in links_filtered:
        # 5.1
        url = urlparse(link)
        # 5.2 and 5.3
        url = url._replace(scheme=res_url.scheme)
        url = url._replace(netloc=res_url.netloc)
        # 5.4
        if "?page=" in link:
          next_ = url._replace(path=res_url.path)
        # 6.
        url = url.geturl()
        print('Url: ', url)
        # 7. Parsing the current page
        yield scrapy.Request(url, 
        callback=self.parseLinks,
        errback= self.errback_,
       
        )

      # 7.
      if next_:     
        yield scrapy.Request(next_.geturl(), 
        callback=self.parse,
        errback= self.errback_,
        )

        # raise CloseSpider('Stop right there') 

      # 8.
      

    def parseLinks(self, response):
      # 7
      link = response.css('div.url + div span b::text').get()
      path = os.path.join(
            os.getcwd(), 'csv/')
      filename = path + 'phishtank.csv'

      # 10. ... 15.
      try:
        with open(filename, 'a+') as fobj:
            writer = csv.writer(fobj, delimiter=',')
            writer.writerow([link, ''])

      except IOError as e:
        print(e)


      





    def errback_ (self, failure):

      if failure.check(HttpError):
        response = failure.value.response
        code = failure.code
        reason = failure.reason
        print(f'''HttpErrorcode {code} on {response.url}
              for the following reason: {reason}''')
        pass
      
      elif failure.check(DNSLookupError):
        request = failure.request
        print(f'DNSLookupError on {request.url}')
        pass

      elif failure.check(TimeoutError, TCPTimedOutError):
        request = failure.request
        print(f'TimeoutError {request.url}')
        pass
    
  