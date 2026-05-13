with open('app/page.tsx', 'r') as f:
    c = f.read()

old = '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Steuer","Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkasse"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Marketing", icon:"📣", items:["Marketing"]},\n      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'

new = '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Steuer","Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete","Strom"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung","Tankstelle"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkasse"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung","Lebensversicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Marketing", icon:"📣", items:["Marketing"]},\n      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'

if old in c:
    c = c.replace(old, new)
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('NOT FOUND')
