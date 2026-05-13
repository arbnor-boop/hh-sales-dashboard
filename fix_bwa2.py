with open('app/page.tsx', 'r') as f:
    c = f.read()

fixes = [
  # HH SCG
  (
    '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Steuer","Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkasse"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}',
    '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Steuer","Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkasse"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Marketing", icon:"📣", items:["Marketing"]},\n      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'
  ),
  # Peak Revenue
  (
    '    bwaKategorien:[\n      {kat:"Steuern & Abgaben", icon:"🏛️", items:["Steuern","Reviso Treuhand","Steckel Legal Tax"]},\n      {kat:"Rechtsberatung", icon:"⚖️", items:["Fechner Rechtsanwälte"]},\n      {kat:"Kapitaleinlagen", icon:"💼", items:["Kapitaleinlage Hamann"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}',
    '    bwaKategorien:[\n      {kat:"Steuern & Abgaben", icon:"🏛️", items:["Steuer","Reviso Treuhand","Steckel Legal Tax"]},\n      {kat:"Rechtsberatung", icon:"⚖️", items:["Rechtsberatung","Fechner Rechtsanwälte"]},\n      {kat:"Kapitaleinlagen", icon:"💼", items:["Kapitaleinlage","Kapitaleinlage Hamann"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'
  ),
  # HP Venius
  (
    '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Sülei Tatli Lohn","Lukas Jukic Lohn","Taim Shakir Lohn","Florian Schimpf Lohn"]},\n      {kat:"Steuern & Abgaben", icon:"🏛️", items:["FTA Steuer"]},\n      {kat:"Überweisungen", icon:"💸", items:["Transfer DTB 1","Transfer DTB 2"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bankgebühren"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}',
    '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Abgaben", icon:"🏛️", items:["Steuer","FTA Steuer"]},\n      {kat:"Überweisungen", icon:"💸", items:["Überweisung","Auslandsüberweisung"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank","Bankgebühren"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'
  ),
  # Hamann & Kollegen
  (
    '    bwaKategorien:[\n      {kat:"Dienstleistungen", icon:"🔧", items:["HH SCG Zahlungen","KROOS KOLLEGEN"]},\n      {kat:"Marketing & Werbung", icon:"📣", items:["Facebook Ads"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["CLOSE CRM","PIXELFLOW","WEBFLOW"]},\n      {kat:"Gebühren & Abgaben", icon:"🏛️", items:["AMTSGERICHT","Kontoführung"]},\n    ]}',
    '    bwaKategorien:[\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Marketing & Werbung", icon:"📣", items:["Marketing"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Gebühren & Abgaben", icon:"🏛️", items:["Gebühren","Kontoführung"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'
  ),
]

for old, new in fixes:
    if old in c:
        c = c.replace(old, new)
        print('Fixed:', old[:50])
    else:
        print('NOT FOUND:', old[:50])

with open('app/page.tsx', 'w') as f:
    f.write(c)
print('Done')
