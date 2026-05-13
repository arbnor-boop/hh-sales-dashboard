with open('app/page.tsx', 'r') as f:
    c = f.read()

old = '''    bwaKategorien:[
      {kat:"Gehälter & Löhne", icon:"👥", items:["Löhne"]},
      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Finanzamt","Steuerberatung"]},
      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete","Strom"]},
      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung","Tankstelle"]},
      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkassen"]},
      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},
      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},
      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},
      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistungen","HP Venius Dubai"]},
      {kat:"Marketing", icon:"📣", items:["Marketing"]},
      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},
      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]},'''

new = '''    bwaKategorien:[
      {kat:"Gehälter & Löhne", icon:"👥", items:["Löhne","Lohn","Gehalt"]},
      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Finanzamt","Steuerberatung","Steuer"]},
      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkassen","Krankenkasse"]},
      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistungen","Dienstleistung","HP Venius Dubai"]},
      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete","Strom"]},
      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung","Tankstelle"]},
      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},
      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},
      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},
      {kat:"Marketing", icon:"📣", items:["Marketing"]},
      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},
      {kat:"Bankgebühren", icon:"🏦", items:["Bank","Bankgebühren"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]},'''

if old in c:
    c = c.replace(old, new)
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('NOT FOUND')
