with open('app/page.tsx', 'r') as f:
    c = f.read()

# Finde und ersetze die HH SCG bwaKategorien komplett
import re

old = re.search(r'(firma:"HH Sales Consulting Germany GmbH".*?bwaKategorien:\[)(.*?)(\],\})', c, re.DOTALL)
if old:
    print("Gefunden bei:", old.start())
    new_kat = '''[
      {kat:"Gehälter & Löhne", icon:"👥", items:["Löhne"]},
      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Finanzamt","Steuerberatung"]},
      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkassen"]},
      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistungen","HP Venius Dubai"]},
      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete","Strom"]},
      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung","Tankstelle"]},
      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},
      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},
      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},
      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]'''
    c = c[:old.start(2)] + new_kat + c[old.end(2):]
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('NOT FOUND')
