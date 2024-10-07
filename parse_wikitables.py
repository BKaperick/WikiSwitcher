import re


re_urls = [
r'<span lang=\"([a-z]{2,3})\">',
r'>([a-z]{2,3}|simple)<',
r'>([a-z]{2,3}\-[a-z]{2,})<',
r'>([a-z]{2,3}\-[a-z]{2,3}\-[a-z]{2,})<'
]

with open("raw_wikitables.html", "r") as fr:
    data = fr.read()
    rows = data.split("</tr><tr ")
    for row in rows:
        #print(row)
        for re_url in re_urls:
            lang = re.search(re_url, row)
            if lang:
                break
        if not lang:
            #print(lang)
            print(row)
        else:
            print(lang.group(1))
        #print("\n")
