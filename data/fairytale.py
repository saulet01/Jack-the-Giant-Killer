import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.stem.snowball import SnowballStemmer
import string

# Adapted from: https://www.datacamp.com/community/tutorials/stemming-lemmatization-python
newWords = nltk.corpus.stopwords.words('english')
newStopWords = ['the', 'then', 'i', 'this', 'but', 'you']
newWords.extend(newStopWords)
wordnet_lemmatizer = WordNetLemmatizer()
englishStemmer=SnowballStemmer("english")
en_stops = set(stopwords.words('english'))
ps = PorterStemmer()

# Open File, Remove spaces, Split, Remove Stopwords and Append to the List
file = open('jack.txt')
listWithPrep = list()
for i in file:
    # Remove Spaces Before and After
    i.strip()
    # Split Sentences
    a = i.split()
    for j in a:
        if j not in en_stops:
            listWithPrep.append(j)

countDictionary = dict()
# Remove Punctuation from the List
for i in listWithPrep:
    for d in string.punctuation:
        i = i.replace(d, "")
    # Remove Begininng Quote
    if i.startswith('“'):
        i = i[1:]
    # Remove End Quote
    if i.endswith('”'):
        i = i[:-1]
    # Snowball = "having " => "have"
    i = englishStemmer.stem(i)

    # Lemmatization = "ladies" => "lady"
    i = wordnet_lemmatizer.lemmatize(i)

    if i not in en_stops:
        # Make Dictionary of Count
        countDictionary[i] = countDictionary.get(i, 0) + 1

# Adapted from: https://www.coursera.org/learn/python-data
finalList = list()
for key, value in countDictionary.items():
    tuple1 = (value, key)
    finalList.append(tuple1)

counting = 1
finalList = sorted(finalList, reverse=True)
fhand = open('app.js','w')
fhand.write('let cloudData = [ \n')
for value, key in finalList[:44]:
    if counting == len(finalList[:44]):
        fhand.write('  {' + 'word:' + '"' + str(key) + '"'+ ', ' + 'value:' + str(value) + '}\n')
        break
    fhand.write('  {' + 'word:' + '"' + str(key) + '"'+ ', ' + 'value:' + str(value) + '},\n')
    counting = counting + 1
print(counting)
fhand.write('] \n')
fhand.close()
