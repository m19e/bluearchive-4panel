# bluearchive-4panel

Auto Update JSON for Blue Archive official 4-panel manga

[![ci](https://github.com/m19e/4panel-scraper/actions/workflows/ci.yml/badge.svg)](https://github.com/m19e/4panel-scraper/actions/workflows/ci.yml)
[![update](https://github.com/m19e/4panel-scraper/actions/workflows/update.yml/badge.svg)](https://github.com/m19e/4panel-scraper/actions/workflows/update.yml)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

## Recent Update

- 2024/12/11 wikiの構造変更に伴うデータ取得処理の修正

## JSON URL

- https://m19e.github.io/bluearchive-4panel/panels/ja.json
- https://m19e.github.io/bluearchive-4panel/panels/en.json
- https://m19e.github.io/bluearchive-4panel/panels/aoharu.json

## Data Format

### 4-Panel

| Field    | Type     | Value                    |
| -------- | -------- | ------------------------ |
| id       | string   | ID (index)               |
| title    | string   | Title                    |
| students | string[] | Student name (ja)        |
| href     | string   | Tweet or Official URL    |
| deleted? | boolean  | Flag for deleted 4-panel |

#### Example

```json
[
  {
    "id": "41",
    "title": "折衷案",
    "students": ["エイミ", "ヒマリ"],
    "href": "https://bluearchive.jp/comics/41/1",
    "deleted": true
  },
  {
    "id": "42",
    "title": "勇気のポーション",
    "students": ["シグレ", "ノドカ"],
    "href": "https://twitter.com/blue_archivejp/status/1465531285523542017"
  }
]
```

### Student

| Field  | Type           | Value     |
| ------ | -------------- | --------- |
| id     | string         | ID (name) |
| ja     | string         | JA name   |
| en     | string         | EN name   |
| school | string \| null | School ID |

#### Example

en.json => EN key

```json
{
  "hanako": {
    "id": "hanako",
    "ja": "ハナコ",
    "en": "Hanako",
    "school": "trinity"
  }
}
```

ja.json => JA key

```json
{
  "コハル": {
    "id": "koharu",
    "ja": "コハル",
    "en": "Koharu",
    "school": "trinity"
  }
}
```

## Reference

- [ブルアカ攻略 Wiki (4-Panel)](https://bluearchive.wikiru.jp/?Twitter%E9%80%A3%E8%BC%89#Manga)
- [Blue Archive Wiki (Playable)](https://bluearchive.wiki/wiki/Characters)
- [Blue Archive Wiki | Fandom (NPC)](https://bluearchive.fandom.com/wiki/Category:NPC)
