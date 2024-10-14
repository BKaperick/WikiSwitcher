from html.parser import HTMLParser
    
def split_first(lang, char):
    splitted = lang.split(char)
    if len(splitted) == 1:
        return lang.strip()
    else:
        return splitted[0].strip()

def clean_language(lang):
    lang = split_first(lang, '(')
    lang = split_first(lang, '/')
    return lang

class TableParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.in_cell = False
        self.cells = []
    def handle_starttag(self, tag, attrs):
        if tag == "td":
            self.in_cell = True
    def handle_data(self, data):
        if self.in_cell:
            self.cells.append(data)

    def handle_endtag(self, tag):
        if tag == "tr":
            self.process_row()
        elif tag == "td":
            self.in_cell = False

    def process_row(self):
        if len(self.cells) == 2:
            cleaned = [clean_language(x) for x in self.cells]
            languages.append(cleaned)
        elif len(self.cells) == 1 and len(languages) > 0:
            print("Ignoring the second translation ({1}) for {0}".format(languages[-1][0], self.cells[0]))
        self.cells = []
    

def get_language_translation_dict(lang_dict = None):
    if lang_dict == None:
        with open("language_to_language-name.html", "r") as fr:
            data = fr.read()
            parser = TableParser()
            parser.feed(data)
            lang_dict = dict(languages)
    return lang_dict
languages = []
language_dict = get_language_translation_dict()

def translate_language(lang):
    lang_cleaned = lang.strip()
    if lang_cleaned in language_dict:
        return language_dict[lang_cleaned]
    return lang_cleaned
