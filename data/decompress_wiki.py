import bz2
import sys
file = sys.argv[1]
with bz2.open(file, "rb") as f:
    # Decompress data from file
    content = f.read()
print("reading done")

comp = bz2.BZ2Decompressor()
with bz2.open(file, "rb") as f:
    # Decompress data from file
    content = f.read()

with open(wiki_output.txt, "w") as f:
    f.write(content)
# bzip2 -dk filename.bz2
