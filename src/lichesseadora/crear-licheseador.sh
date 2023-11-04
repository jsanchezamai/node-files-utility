mkdir lichesseadora
cd lichesseadora
git clone https://github.com/lichess-org/api-demo.git
cd api-demo
rm -r .git
rm .github
cd ..
mv api-demo lichesseador
cd lichesseador
npm install
npm run build
npm run serve