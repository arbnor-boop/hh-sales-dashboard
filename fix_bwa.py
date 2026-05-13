with open('app/page.tsx', 'r') as f:
    c = f.read()

old = '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Löhne"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkassen"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Lebensversicherung","Versicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistungen","HP Venius Dubai"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'

new = '    bwaKategorien:[\n      {kat:"Gehälter & Löhne", icon:"👥", items:["Lohn","Gehalt"]},\n      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Steuer","Finanzamt","Steuerberatung"]},\n      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},\n      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},\n      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkasse"]},\n      {kat:"Versicherungen", icon:"🛡️", items:["Versicherung"]},\n      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},\n      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},\n      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistung"]},\n      {kat:"Telekommunikation", icon:"📱", items:["Telekommunikation"]},\n      {kat:"Bankgebühren", icon:"🏦", items:["Bank"]},\n      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},\n    ]}'

if old in c:
    c = c.replace(old, new)
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('String not found!')
