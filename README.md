[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/mqGuZK3H)

# <ins> Inlämning 3 Dynamiska Webbsystem 2 </ins>

### <ins> För att starta upp projektet: </ins>

1. Kolla readme för apiet hur man sätter upp databasen och startar detta.


2. För att starta Angular projektet, navigera till projektet i terminalen, sedan kör:
    
    ```
   ng serve
   ```
   
3. För att starta upp vanilla projektet är det bara att starta index.html i live server.

------

### <ins> Reflektion till valet av Angular </ins>

Jag valde att ge mig själv en utmaning genom att utöver att göra projektet in vanlig javascript, 
    även göra det i Angular som jag pillat med lite utöver skolan.  Det var mycket nytt att lära sig men 
    jag har ochså lärt mig väldigt mycket denna veckan pågrund av det. Jag hade kunnat skriva otroligt 
    mycket om detta men det hade blivit väldigt långt så jag har därför kommenterat en del i min kod 
    som förklarar mycket hur vissa saker i Angular fungerar.



#### <ins> Varför Angular? </ins>
Jag har valt att jobba med angular istället för tex React eftersom jag tycker att det är väldigt strikt, 
    man gör saker på vissa sätt och det är inte lika mycket flexibelt som tex React där man kan lägga upp
    projektet precis hur man vill i princip. Jag gillar att angular är mer "opinionated" eftersom jag 
    tycker det kan bli väldigt rörigt när det inte finns fasta "guidelines". Personligen tycker jag 
    även att Angular är mer läsbart och lättare att förstå, delvis syntax och delvis att varje 
    komponent är uppdelade i en html, en css och en ts fil som gör det separerat och bra. En annan sak 
    som jag tycker om är att man måste använda typescript med Angular vilket gör det mer likt C#, även 
    eftersom Angular använder sig av "dependency injection" och mer klass baserad javascript, vilket det 
    är mycket av i C#, det blev därför lättare för mig att förstå än Reacts kanske mer funktionella stil.


#### <ins> Fördelarn med ett ramverk </ins>
Den absolut största fördelen med ett ramverk enligt mig är komponent arkitekturen som används i alla 
    stora javascript ramverk. Detta gör det otroligt mycket mindre rörigt när projektet växer eftersom 
    man kan ha komponenter med html,css och javascript helt isolerade och återanvändningsbara. Detta är 
    en av den största anledningen som ramverk ens finns för javascript skulle jag tro.

#### <ins> Angular Material </ins>
Jag valde att använda mig av Angular material som är ett komponentbibliotek liknande Bootstrap fast endast 
för Angular. Dessa komponenter använder samma styleguide och gör att man kan göra väldigt snygga och enhetliga 
sidor utan att göra all design osv själv vilket kan ta mycket tid för att få till bra. Detta är skapat av Angular 
teamet på Angular och är effektiva och har även bra tillgänglighet "from scratch".

--------

### <ins> Analys och reflektion </ins>

#### <ins> Prestanda </ins>
Detta tycker jag är otroligt svårt att säga med denna uppgiften, men jag tycker att det är viktigt att 
endast göra api calls som verkligen används och inte i onödan som bara tar resurser. En annan viktig sak 
är att endast hämta den informationen som behövs, tex om man hämtar alla reviews och har en stor applikation
finns det otroligt många säkert, då måste man hitta ett bra sätt att hämta lite i taget för att fortfarande 
hålla bra prestanda på sidan.

#### <ins> Skalbarhet </ins>
Jag tycker både min vanilla och Angular har relativt bra skalbarhet, i vanilla är mina api calls uppdelade 
i andra filer (services) som gör det enkelt att hitta just dessa. Samma i mitt Angular projekt har jag 
services för mina entiteter som finns på ett ställe, dette gör det lätt att hitta och mer skalbart.

#### <ins> Säkerhet </ins> 
En sak som hade kunnats göra bättre här är att konfigurera CORS till endast den address som min frontend 
använder, men detta ingick inte i uppgiften. Detta gör egentligen att endast denna url kan göra api calls 
till mitt api och inte andra addresser, vilket bidrar till bättre säkerhet.

#### <ins> Underhållbarhet </ins> 
Speciellt i mitt Angular projekt är underhållbarheten god. Eftersom en del är uppdelat i komponenter vilket 
gör det lättare att hitta och på det sättet även lättare att underhålla. Man kan enkelt hitta till alla 
interfaces (models, dtos) tex och det finns en dedikerad mapp för endast detta.


