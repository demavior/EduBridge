from django import template

register = template.Library()

@register.filter
def get_responses(responses, question):
    return responses.filter(question=question)
