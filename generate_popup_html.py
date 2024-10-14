import re
import sys
from parse_languages import translate_language

re_urls = [
r'<span lang=\"([a-z]{2,3})\">',
r'>([a-z]{2,3}|simple)<',
r'>([a-z]{2,3}[-–][a-z]{2,})<',
r'>([a-z]{2,3}[-–][a-z]{2,3}[-–][a-z]{2,})<'
]

re_english_lang_name = [
r"""title=\"[\w\-–']* languages?\">([\w'\s]*)<""",
r"""title=\"[\w']* [\w']* \w+\b(?<!\bWikipedia)\">([\w'\s]*)<""",
r"""title=\"[\w']* \w+\b(?<!\bWikipedia)\">([\w'\s]*)<""",
r'title=\"\w*\">([\w\s]*)<',
r'>([A-zÀ-ÿ]{2,}[-–][A-zÀ-ÿ]{2,})<'
]
re_user_count = [
r'>([\d,]+)<'
]

POPULAR_LANGUAGE_THRESHOLD = 10

langs = []
with open(sys.argv[1], "r") as fr:
    data = fr.read()
    rows = data.split("</tr><tr ")
    for row in rows:
        cells = row.split("</td><td ")
        for re_url in re_urls:
            lang = re.search(re_url, cells[3])
            if lang:
                break
        for re_name in re_english_lang_name:
            name = re.search(re_name, cells[1])
            if name:
                break
        for re_count in re_user_count:
            user_count = re.search(re_count, cells[5])
            if user_count:
                break

        if (not lang) or (not name) or (not user_count):
            print("Failed to parse: " + row)
        else:
            langs.append({'name': name.group(1), 'url': lang.group(1), 'count': int(user_count.group(1).replace(",",""))})

def popular_adj_sort(langs, top_pop):
    '''
    Display the top `top_pop` languages first for convenience, and then order the rest alphabetically
    '''
    output = sorted(langs, key=lambda x : -x['count'])[:top_pop]
    used = set([x['name'] for x in output])
    for lang in sorted(langs, key=lambda x : x['name']):
        if lang['name'] not in used:
            output.append(lang)
    return output

langs = popular_adj_sort(langs, POPULAR_LANGUAGE_THRESHOLD)

with open("data/popup_header.html","r") as f:
    header = f.read()
    output = header
    output_translated = header

list_separator = """<br>

<h4>All other Wikipedia languages</h4>
<div class="otherlanguages" >
"""

for i,lang in enumerate(langs):
    translated = translate_language(lang['name'])
    output_translated += """<input type="checkbox" id="{0}" name="{2}" value="{0}"><label for="{0}">{1}</label><br>\n""".format(lang['url'], translated, lang['name'].lower())
    output += """<input type="checkbox" id="{0}" name="{2}" value="{0}"><label for="{0}">{1}</label><br>\n""".format(lang['url'], lang['name'], lang['name'].lower())
    if i == POPULAR_LANGUAGE_THRESHOLD - 1:
        output += list_separator
        output_translated += list_separator

with open("data/popup_footer.html","r") as f:
    footer = f.read()
    output += footer
    output_translated += footer

with open ("src/popup.html", "w") as f:
    f.write(output)
with open ("src/popup_translated.html", "w") as f:
    f.write(output_translated)
