[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/VL9E0aaN)

# Inlämning 2 REST API

För att komma igång och köra apiet med tillhörande databas:

1. Klona ner detta repo och starta upp projektet i valfri IDE.


2. Öppna appsettings.json och lägg till din connectionstring till din lokala server. <br>
    Klistra in denna med din server:

    ```json
    {
    "ConnectionStrings": {
      "DefaultConnection": "Server={{Din Server}};Database=inlamning2REST;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
    }
   ```
3. Öppna Package Manager Console och kör följande kommandon:
    ```bash
    Add-Migration InitialCreate
    Update-Database
    ```
   
4. Detta borde skapa upp databasen med seedade värden för Movies, Reviews och även 2 IdentityUsers. <br>
    Inlogg till dessa andvändare är: <br>

    ```bash
    Email: user1@example.com
    Password: Admin123!
   
   Email: user2@example.com
   Password: Admin123!
    ```
   Jag valde att seeda users bara för att varje review ska ha en user som skapat den.


5. Starta upp projektet för att testa alla endpoints smidigt i swagger.


### Analys och reflektion

**Prestanda:** <br>
Det finns inte jättemycket att säga om prestandan i detta projektet eller hur jag hade kunnat förbättra den,
dock finns det en sak som jag vet kan förbättra prestandan. Det jag talar om är "AsNoTracking" som jag använder 
i mina "readonly" endpoints. Detta gör att EF inte behöver hålla koll på ändringar som görs till databas entities och
kan på det sättet förbättra prestandan eftersom det tar resurser av Entity Framework att tracka dessa entities och
hålla koll på ändringar. Ett bra bloginlägg som förklarar lite [Här](https://www.c-sharpcorner.com/article/maximizing-performance-in-entity-framework-co-tracking-vs-no-tracking/)<br>

**Skalbarhet:** <br>
Jag tycker applikationen är skalbar på det viset att den är tydligt strukturerad och lätt att hitta i och navigera sig.
Även Configuration filen för program.cs gör det lättare att utöka med fler services och middleware utan att program.cs
blir bloatet och svår att navigera i. Det som hade kunnat göra applikationen mer skalbar är att kanske handera felhantering
på ett mer strukturerat sätt genom tex filter eller vissa klasser för detta. Och detta i sin tur gör att controllersen inte
blir bloated med massa felhantering.<br>

**Säkerhet:** <br>
Säkerheten tycker jag är svårt att analysera eftersom mycket av säkerheten med tex authentisering och authorization tas
hand om av Identity. Men jag tycker att jag har gjort ett bra jobb med att säkra upp endpoints som kräver autentisering
genom att använda [Authorize] attributen, så att endast inloggade användare kan "komma igenom" dessa endpoints. Jag tror
också att det är bra att lämna mycket av inloggningssäkerheten till Identity eftersom det är ett stort och väletablerat
framework som många använder sig av, därför måste det vara säkert. <br>

**Underhållbarhet:** <br>
Detta är lite likt skalbarhet som jag skrev om tidigare, man hade kunnat göra applikationen mer underhållbar genom att
se till att controllersen inte blir för bloated med massa felhantering och annat som inte har med själva logiken att göra.
Viktigt att tänka på är att om man skriver något likandant mer än 2 gånger så är det dags att skapa en metod eller klass
för detta, annars kan det lätt gå över kontroll och blir svårt att underhålla. <br>

### Alla Endpoints

<details>
<summary>MovieController</summary>

**GET /api/Movie:** <br>
Returnerar en lista över alla filmer i databasen. Filmerna returneras som JSON-objekt och inkluderar deras associerade recensioner. Denna endpoint kräver inte autentisering. Varje film-objekt har följande struktur:

```json
{
  "Id": "int",
  "Title": "string",
  "ReleaseYear": "int",
  "Reviews": [
    {
      "Id": "int",
      "Grade": "int",
      "Comment": "string",
      "MovieId": "int",
      "UserId": "string"
    },
    ...
  ]
}
```

**GET /api/Movie/{id}:** <br>
Returnerar en enskild film med det angivna ID:t. Filmen returneras som ett JSON-objekt och inkluderar dess associerade recensioner. Denna endpoint kräver inte autentisering. Film-objektet har samma struktur som ovan.

**PUT /api/Movie/{id}:** <br>
Uppdaterar filmen med det angivna ID:t. Denna endpoint kräver autentisering och accepterar ett JSON-objekt med de nya filmdetaljerna i bodyn. Den bör ha följande struktur:

```json
{
  "Title": "string",
  "ReleaseYear": "int"
}
```

**POST /api/Movie:** <br>
Skapar en ny film. Denna endpoint kräver autentisering och accepterar ett JSON-objekt med filmdetaljerna i bodyn. Den bör ha samma struktur som för **PUT /api/Movie/{id}**.

**DELETE /api/Movie/{id}:** <br>
Tar bort filmen med det angivna ID:t. Denna endpoint kräver autentisering. Returnerar statuskod 204 (No Content) vid framgång.

**GET /api/Movie/{id}/reviews:** <br>
Returnerar en lista över alla recensioner för filmen med det angivna ID:t. Recensionerna returneras som JSON-objekt. Denna endpoint kräver inte autentisering. Varje recensionsobjekt har följande struktur:

```json
{
  "Id": "int",
  "Grade": "int",
  "Comment": "string",
  "MovieId": "int",
  "UserId": "string"
}
```

</details>
<details>
<summary>ReviewController</summary>

**GET /api/Review:** <br>
Returnerar en lista över alla recensioner i databasen. Recensionerna returneras som JSON-objekt. Denna endpoint kräver inte autentisering. Varje recensionsobjekt har samma struktur som **GET /api/Movie/{id}/reviews:**.

**GET /api/Review/{id}:** <br>
Returnerar en enskild recension med det angivna ID:t. Recensionen returneras som ett JSON-objekt. Denna endpoint kräver inte autentisering. Recensionsobjektet har samma struktur som ovan.

**PUT /api/Review/{id}:** <br>
Uppdaterar recensionen med det angivna ID:t. Denna endpoint kräver autentisering och accepterar ett JSON-objekt med de nya recensionsdetaljerna i bodyn. Den bör ha följande struktur:

```json
{
  "Grade": "int",
  "Comment": "string",
  "MovieId": "int"
}
```

**POST /api/Review:** <br>
Skapar en ny recension. Denna endpoint kräver autentisering och accepterar ett JSON-objekt med recensionsdetaljerna i bodyn. Den bör ha samma struktur som för **PUT /api/Review/{id}**.

**DELETE /api/Review/{id}:** <br>
Tar bort recensionen med det angivna ID:t. Denna endpoint kräver autentisering. Returnerar statuskod 204 (No Content) vid framgång.

</details>

<details>
<summary>UserController</summary>

**GET /api/User/reviews:** <br>
Returnerar en lista över alla recensioner skrivna av den för närvarande autentiserade användaren. Recensionerna returneras som JSON-objekt. Denna endpoint kräver autentisering. Varje recensionsobjekt har samma struktur som ovan.

</details>
