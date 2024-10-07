import re

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
#a-zA-Z\u00C0-\u024F\u1E00-\u1EFF

langs = []
with open("raw_wikitables.html", "r") as fr:
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
        
        if not lang or not name:
            print("Failed to parse: " + row)
            print(cells[3])
            print(lang)
            print(cells[1])
            print(name)
            #print(row)
        else:
            pass
            #print(lang.group(1))
            #print(name.group(1))
            langs.append({'name': name.group(1), 'url': lang.group(1)})

langs.sort(key=lambda x : x['name'])

output = """<!DOCTYPE html>
<head>
  <script src="popup.js"></script>
</head>
<body>
<h1>Hello</h1>
<h2>Check all languages that you speak</h2>

<form id="language_selector">
"""
for lang in langs:
  output += """<input type="checkbox" id="{0}" name="{2}" value="{0}"><label for="{0}">{1}</label><br>\n""".format(lang['url'], lang['name'], lang['name'].lower())

output += """
  <input type="submit" value="Submit">
</form>
</body>
"""
print(output)
