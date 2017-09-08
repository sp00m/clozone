# Clozone

Clozone is a little game inspired by the famous Dots and Boxes. It is deployed via OpenShift at https://clo.zone. Don't hesitate to fork it and improve it, pull requests are very welcome!

## License

GNU General Public License v3.0

### Copyright

Clozone, the funny game that freshens Dots and Boxes!
Copyright (C) 2017 Christophe Maillard <christophe.maillard@rocketmail.com>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.

## Notes

You'll notice that I haven't put a lot of efforts into the HTML/CSS, first because it kind of bores me, but also and especially because the initial purpose was to play with ES6 and PWA. Feel free to improve the finish if you have an UI/UX-enhanced brain!

## Run it

```text
npm install
npm run watch
```

Then go to http://localhost:3000 and enjoy :)

## TODO

### Technical improvements

- [x] SASS
- [x] ESLint
- [x] Node.js clustering
- [x] Progressive Web App
- [ ] Accelerated Mobile Page?
- [ ] Native app?
- [x] ES6 with Babel
- [ ] ES7
- [ ] TypeScript
- [ ] ~~React or Angular 4+~~ Svelte
- [ ] Webpack
- [ ] CSS grids + autoprefixer
- [ ] ...

### Features

- [x] Solo mode, easy level
- [x] Solo mode, hard level
- [x] Multiplayer mode, offline
- [ ] Multiplayer mode, online (WebSocket FTW!)
- [ ] A page explaining the rules and the way points are calculated
- [ ] Fake random "thinking time" for AI
- [ ] ...

Plus any other ideas you may have ;)
