# DevMarket — Plateforme de vente et d'achat de projets informatiques

## 1. Présentation du projet

**DevMarket** est une plateforme web qui facilite la mise en relation entre les développeurs et les clients souhaitant acheter des projets informatiques.

Le projet est né d'un constat : sur certaines plateformes de freelance, les développeurs et les clients doivent supporter des frais ou des commissions pour accéder à des opportunités, entrer en contact ou réaliser des transactions.

DevMarket propose une approche plus directe, en permettant aux développeurs de présenter leurs projets et aux clients de découvrir des opportunités d'achat, puis de négocier ensemble grâce à une messagerie intégrée.

L'objectif est de favoriser une communication simple, transparente et accessible, tout en donnant aux développeurs davantage de possibilités pour valoriser leur travail et trouver des clients, sans imposer de frais de mise en relation sur la plateforme.

## 2. Objectifs

Les principaux objectifs de DevMarket sont :

- Faciliter la mise en relation entre les développeurs et les clients.
- Permettre aux développeurs de présenter et de commercialiser leurs projets informatiques.
- Aider les clients à découvrir des projets correspondant à leurs besoins et à leur budget.
- Simplifier les négociations grâce à une messagerie intégrée.
- Favoriser les échanges directs entre les deux parties.
- Réduire les obstacles financiers liés à l'accès aux opportunités commerciales.
- Encourager la valorisation et la commercialisation des projets développés.

## 3. Fonctionnalités principales

### Pour les développeurs

- Publier des projets informatiques.
- Ajouter les informations essentielles de chaque projet :
  - Nom du projet.
  - Prix proposé.
  - Description détaillée.
  - URL du projet ou de sa démonstration.
  - Capture d'écran facultative.
- Présenter leurs réalisations aux clients potentiels.
- Consulter les échanges avec les clients intéressés.
- Négocier directement les conditions de vente.

### Pour les clients

- Consulter les projets publiés sur la plateforme.
- Découvrir de nouvelles opportunités d'achat.
- Consulter les descriptions, les prix et les captures d'écran disponibles.
- Accéder aux URL des projets lorsqu'elles sont fournies.
- Contacter les développeurs via la messagerie intégrée.
- Discuter des prix et négocier les conditions d'acquisition.

### Messagerie intégrée

DevMarket intègre un système de messagerie permettant aux développeurs et aux clients de communiquer directement.

Cette fonctionnalité vise à simplifier les échanges, à faciliter les négociations et à éviter de multiplier les outils de communication externes.
Les messages sont supprimés automatiquement après 30 jours.

## 4. Architecture technique

DevMarket adopte une **architecture monolithique** : le backend regroupe les fonctionnalités métier et les points d'accès à l'API, tandis que le frontend constitue l'interface utilisateur. Les deux parties sont organisées en applications distinctes au sein du projet.

### Vue d'ensemble

```text
                    UTILISATEURS
                  /             \
             Développeurs       Clients
                  \             /
                   \           /
                FRONTEND ANGULAR
                Interface utilisateur
                        |
                     HTTP/JSON
                        |
                 BACKEND FASTAPI
             API REST et logique métier
                        |
                  BASE DE DONNÉES
                      MySQL
```

### Backend

Le backend est développé avec **FastAPI**, un framework Python permettant de construire des API performantes.

Responsabilités principales :
- Gestion des utilisateurs.
- Gestion des projets publiés.
- Exposition des API REST.
- Gestion des conversations et des messages.
- Validation des données reçues.
- Interaction avec la base de données MySQL.

### Frontend

Le frontend est développé avec **Angular**, un framework permettant de construire des interfaces web dynamiques.

Responsabilités principales :
- Affichage du catalogue des projets.
- Présentation des détails de chaque projet.
- Gestion des formulaires de publication.
- Interfaces de connexion et d'inscription.
- Affichage des projets publiés par les développeurs.
- Interface de messagerie et de négociation.

### Base de données

**MySQL** assure le stockage persistant des données de l'application, notamment :
- Les comptes utilisateurs.
- Les projets publiés.
- Les informations associées aux projets.
- Les conversations et les messages échangés.

## 5. Technologies utilisées

| Technologie | Rôle |
|---|---|
| Python | Langage du backend |
| FastAPI | Développement de l'API REST |
| Angular | Développement du frontend |
| TypeScript | Développement de l'application Angular |
| MySQL | Gestion des données persistantes |
| HTTP/JSON | Communication entre le frontend et le backend |
| Git | Gestion du versionnement du code |

## 6. Organisation du projet

L'organisation générale du projet est la suivante :

```text
DevMarket/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
└── README.md
```



## 7. Principe de fonctionnement

Le fonctionnement de DevMarket repose sur un processus simple :

1. Un développeur publie un projet en renseignant son nom, son prix, sa description et son URL, avec la possibilité d'ajouter une capture d'écran.
2. Un client parcourt le catalogue pour identifier les projets qui correspondent à ses besoins.
3. Le client contacte le développeur à travers la messagerie intégrée.
4. Les deux parties échangent sur le projet, son prix et les conditions de vente.
5. Si elles trouvent un accord, elles peuvent poursuivre la transaction selon les modalités convenues.

La plateforme facilite la découverte des projets et la communication. Elle ne garantit pas, à elle seule, la réalisation ou la sécurisation du paiement.

## 8. Proposition de valeur

DevMarket cherche à proposer une alternative accessible aux modèles de mise en relation qui imposent des frais ou des commissions.

Sa proposition de valeur repose sur trois principes :

**Accessibilité :** faciliter l'accès aux opportunités commerciales pour les développeurs et les clients.

**Communication directe :** permettre aux deux parties de discuter et de négocier sans intermédiaire imposé par la plateforme.

**Valorisation des projets :** donner aux développeurs un espace pour présenter leurs réalisations et rechercher des acheteurs potentiels.

L'ambition est de construire un environnement où la recherche de projets et les échanges commerciaux sont plus simples et plus accessibles.

## 9. Perspectives d'évolution

Plusieurs fonctionnalités pourraient enrichir DevMarket :

- Système d'évaluation et d'avis.
- Filtres de recherche par prix, catégorie et technologie.
- Gestion des favoris.
- Notifications lors de la réception de nouveaux messages.
- Suivi du statut des négociations.
- Vérification des comptes utilisateurs.
- Mécanismes de signalement et de modération.
- Paiement sécurisé et gestion des transactions.
- Tableau de bord statistique pour les développeurs.
- Déploiement en production avec une configuration sécurisée.

Ces éléments constituent des pistes d'évolution et ne sont pas nécessairement disponibles dans la version actuelle.


## 10. Conclusion

DevMarket est un projet visant à simplifier la commercialisation de projets informatiques et à améliorer les échanges entre développeurs et clients.

En combinant Angular, FastAPI et MySQL dans une architecture monolithique, la plateforme offre une base technique pour la publication de projets, leur consultation et la négociation directe grâce à une messagerie intégrée.

Son ambition est de faciliter l'accès aux opportunités commerciales, de favoriser la valorisation du travail des développeurs et de réduire les obstacles financiers à la mise en relation.

---

**DevMarket — Des projets, des opportunités et une communication directe.**
**Dev** : METHNANI Sahbi 