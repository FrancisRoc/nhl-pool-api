Feature: Test des utilitaires
    Tester l'utilitaire de conversion d'une chaîne de caractère vers un booléen

    Scenario: Convertir la chaîne de caractère "null"" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "null"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "true" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "true"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être true

    Scenario: Convertir la chaîne de caractère "TRUE" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "TRUE"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être true

    Scenario: Convertir la chaîne de caractère "TrUe" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "TrUe"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être true

    Scenario: Convertir la chaîne de caractère "false" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "false"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "FALSE" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "FALSE"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "FaLsE" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "FaLsE"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "1" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "1"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être true

    Scenario: Convertir la chaîne de caractère "2" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "2"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec ""
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "99" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "99"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

    Scenario: Convertir la chaîne de caractère "Nous aimons Martin Janelle" en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec "Nous aimons Martin Janelle"
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être false

Scenario Outline: Convertir une valeur en utilisant l'utilitaire de conversion de chaîne vers booléen
        Given Le paramètre "str" est renseigné avec <stringToConvert>
        When L'utilitaire de conversion est appelé
        Then Le résultat devrait être <result>

        Examples:
            |                          stringToConvert | result |
            |                                   "null" |  false |
            |                                   "true" |   true |
            |                                   "TRUE" |   true |
            |                                   "TrUe" |   true |
            |                                  "false" |  false |
            |                                  "FALSE" |  false |
            |                                  "FaLsE" |  false |
            |                                      "1" |   true |
            |                                      "2" |  false |
            |                                       "" |  false |
            |                                     "99" |  false |
            |             "Nous aimons Martin Janelle" |  false |
