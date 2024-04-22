"""
# Author: Sameer Karali 

This file contains a custom template tag that requests a text from oembed and returns the html element

"""

import requests
from django import template

register = template.Library()


@register.simple_tag
def text_tags(url:str) -> str:
    """ Requests a text from oembed and returns the html element """
    
    try:
        tweet_request = requests.get('https://publish.twitter.com/oembed?url=' + url + '&omit_script=true')
        tweet_json = tweet_request.json()
        tweet_html = tweet_json['html']
        return tweet_html
    except Exception as exc:
        return " " + url

