# SmartPumpSystem
## Requirements
- git
- python3
- pip
- npm
- venv(optional)
## Installation
Clone this repository to a workspace folder, in linux,
```bash
git clone https://github.com/musyafaarif/SmartPumpSystem.git
```
or from a forked repository,
```bash
git clone https://github.com/"USERNAME"/SmartPumpSystem.git
```
<br>

Install python requirements inside SmartPumpSystem folder,
```bash
cd SmartPumpSystem
pip install -r requirements.txt
```
<br>

Setup the django databases, migrate and load cities database
```bash
python manage.py migrate
python manage.py loaddata database/location.json
```
<br>

Install npm libraries inside frontend folder,
```bash
cd frontend
npm install
```
Build `main.js` for the first time,
```bash
npm run build
```
> Ignore the warnings, we still on the development
<br>

## Testing & Running
Get inside workspace folder,
```bash
cd SmartPumpSystem
```

Run django server
```bash
python manage.py runserver 127.0.0.1:8000
```
Test in your web browser http://127.0.0.1:8000
<br>

If you want to create a user, close the server using Ctrl+C, then run
```bash
python manage.py createsuperuser
```
Then run the server again
