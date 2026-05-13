with open('app/page.tsx', 'r') as f:
    c = f.read()

old = 'result.push({firma:currentFirma, datum:ausDatum, name:ausName, betrag:ausBetrag, kategorie:ausKat||"Ausgaben", monat:(MONAT_MAP[mm]||mm)+" "+yy});'
new = 'const kat = (ausKat&&ausKat!=="Ja"&&ausKat!=="Nein"&&ausKat!=="ja"&&ausKat!=="nein") ? ausKat : "Ausgaben"; result.push({firma:currentFirma, datum:ausDatum, name:ausName, betrag:ausBetrag, kategorie:kat, monat:(MONAT_MAP[mm]||mm)+" "+yy});'

if old in c:
    c = c.replace(old, new)
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('NOT FOUND')
