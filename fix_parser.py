with open('app/page.tsx', 'r') as f:
    c = f.read()

old = 'const kat = (ausKat&&ausKat!=="Ja"&&ausKat!=="Nein"&&ausKat!=="ja"&&ausKat!=="nein") ? ausKat : "Ausgaben"; result.push({firma:currentFirma, datum:ausDatum, name:ausName, betrag:ausBetrag, kategorie:kat, monat:(MONAT_MAP[mm]||mm)+" "+yy});'

new = '''const rawKat = (ausKat&&ausKat!=="Ja"&&ausKat!=="Nein"&&ausKat!=="ja"&&ausKat!=="nein") ? ausKat : "";
      const n = ausName.toLowerCase();
      const autoKat = !rawKat ? (
        n.includes("lohn") || n.includes("gehalt") ? "Lohn" :
        n.includes("finanzamt") || n.includes("steuer") || n.includes("tax") || n.includes("kfz-steuer") ? "Steuer" :
        n.includes("krankenkasse") || n.includes("aok") || n.includes("tkk") || n.includes("barmer") ? "Krankenkasse" :
        n.includes("miete") ? "Miete" :
        n.includes("leasing") ? "Leasing" :
        n.includes("versicherung") ? "Versicherung" :
        n.includes("db vertrieb") || n.includes("deutsche bahn") || n.includes("db bahn") || n.includes("booking.com") || n.includes("hotel") || n.includes("taxi") || n.includes("restaurant") || n.includes("rückerstattung") ? "Reisekosten" :
        n.includes("telekom") || n.includes("vodafone") || n.includes("mobilfunk") ? "Telekommunikation" :
        n.includes("tankstelle") || n.includes("aral") || n.includes("hem ") ? "Tankstelle" :
        n.includes("claude") || n.includes("software") || n.includes("google workspace") || n.includes("zoom") || n.includes("slack") || n.includes("close crm") || n.includes("atlassian") || n.includes("webflow") || n.includes("hostinger") || n.includes("zapier") || n.includes("monday") || n.includes("vimeo") || n.includes("calendly") || n.includes("ionos") || n.includes("anthropic") || n.includes("recruitee") || n.includes("jotform") || n.includes("jumpshare") || n.includes("cookiebot") || n.includes("stitchdata") || n.includes("figma") || n.includes("airtable") || n.includes("openai") || n.includes("perplexity") || n.includes("lovable") || n.includes("manus") || n.includes("n8n") || n.includes("onecal") || n.includes("easybill") ? "Software" :
        n.includes("hp venius") || n.includes("stefan michalea") || n.includes("skalator") || n.includes("pineapple") || n.includes("moritz winter") || n.includes("bd berlin") || n.includes("dienstleist") ? "Dienstleistung" :
        n.includes("facebook") || n.includes("facebk") || n.includes("marketing") ? "Marketing" :
        "Sonstiges"
      ) : rawKat;
      result.push({firma:currentFirma, datum:ausDatum, name:ausName, betrag:ausBetrag, kategorie:autoKat, monat:(MONAT_MAP[mm]||mm)+" "+yy});'''

if old in c:
    c = c.replace(old, new)
    with open('app/page.tsx', 'w') as f:
        f.write(c)
    print('Done')
else:
    print('NOT FOUND')
