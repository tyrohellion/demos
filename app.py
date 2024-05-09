from flask import Flask, request, jsonify, render_template
from octanegg import Octane

app = Flask(__name__)

octane_api = Octane()

@app.route('/')
def index():
    page = request.args.get('page', default=1, type=int)
    per_page = 20
    results = octane_api.get_matches(page=page, per_page=per_page, sort='date:desc', tier="S")
    eventscard = octane_api.get_events(page=page, per_page=per_page, tier="S", order='date:desc', after='2023-01-01')
    eventsS = octane_api.get_events(page=page, per_page=per_page, tier="S", order='date:desc', after='2023-08-01')
    eventsA = octane_api.get_events(page=page, per_page=per_page, tier="A", order='date:desc', after='2024-01-01')
    teams = octane_api.get_teams(page=page, per_page=per_page)
    event = octane_api.get_event_participants(event_id='65a825ea370e82dfea34e7ac')
    return render_template('index.html', results=results, eventscard=eventscard, eventsS=eventsS, eventsA=eventsA, teams=teams, event=event)

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/matches')
def matches():
    return render_template('matches.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/teams')
def teams():
    return render_template('teams.html')

@app.route('/players')
def players():
    return render_template('players.html')

@app.route('/search')
def search():
    query = request.args.get('query')
    players = octane_api.get_players(tag=query)
    teams = octane_api.get_teams(name=query)
    events = octane_api.get_events(name=query)
    return jsonify(players=players, teams=teams, events=events)

@app.route('/event/<event_id>')
def get_event(event_id):
    event = octane_api.get_event(event_id)
    participants = octane_api.get_event_participants(event_id)
    page = request.args.get('page', default=1, type=int)
    per_page = 10
    matches = octane_api.get_matches(event=event['_id'], page=page, per_page=per_page, sort='date:desc')
    format = request.args.get('format', 'html')
    
    if format == 'json':
        return jsonify(event=event)
    else:
        return render_template('event_info.html', event=event, participants=participants, matches=matches, page=page, per_page=per_page)

@app.route('/event/<event_id>/matches')
def get_event_matches(event_id):
    matches = octane_api.get_event_matches(event_id)
    return jsonify(matches=matches)

@app.route('/event/<event_id>/participants')
def get_event_participants(event_id):
    participants = octane_api.get_event_participants(event_id)
    return jsonify(participants=participants)

@app.route('/match/<match_id>')
def get_match(match_id):
    match = octane_api.get_match(match_id)
    games = octane_api.get_match_games(match_id)

    if format == 'json':
        return jsonify(match=match, games=games)
    else:
        return render_template('match_info.html', match=match, games=games)

@app.route('/games')
def get_games():
    event = request.args.get('event')
    stage = request.args.get('stage')
    match = request.args.get('match')
    qualifier = request.args.get('qualifier')
    tier = request.args.get('tier')
    region = request.args.get('region')
    mode = request.args.get('mode')
    group = request.args.get('group')
    before = request.args.get('before')
    after = request.args.get('after')
    best_of = request.args.get('bestOf')
    player = request.args.get('player')
    team = request.args.get('team')
    sort = request.args.get('sort')
    order = request.args.get('order')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 100))

    games = octane_api.get_games(event=event, stage=stage, match=match, qualifier=qualifier, 
                                  tier=tier, region=region, mode=mode, group=group, 
                                  before=before, after=after, best_of=best_of, 
                                  player=player, team=team, sort=sort, order=order, 
                                  page=page, per_page=per_page)
    return jsonify(games=games)

@app.route('/game/<game_id>')
def get_game(game_id):
    game = octane_api.get_game(game_id)
    return render_template('match_info.html', game=game)

@app.route('/players')
def get_players():
    tag = request.args.get('tag')
    country = request.args.get('country')
    team = request.args.get('team')
    sort = request.args.get('sort')
    order = request.args.get('order')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 100))

    players = octane_api.get_players(tag=tag, country=country, team=team, 
                                      sort=sort, order=order, page=page, per_page=per_page)
    return jsonify(players=players)

@app.route('/player/<player_id>')
def get_player(player_id):
    player = octane_api.get_player(player_id)
    page = request.args.get('page', default=1, type=int)
    per_page = 10
    matches = octane_api.get_matches(player=player['_id'], page=page, per_page=per_page, sort='date:desc')
    format = request.args.get('format', 'html')
    
    if format == 'json':
        return jsonify(player=player, matches=matches)
    else:
        return render_template('player_info.html', player=player, matches=matches, page=page, per_page=per_page)

@app.route('/teams')
def get_teams():
    name = request.args.get('name')
    sort = request.args.get('sort')
    order = request.args.get('order')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 100))

    teams = octane_api.get_teams(name=name, sort=sort, order=order, page=page, per_page=per_page)
    return jsonify(teams=teams)

@app.route('/team/<team_id>')
def get_team(team_id):
    team = octane_api.get_team(team_id)
    page = request.args.get('page', default=1, type=int)
    per_page = 10
    matches = octane_api.get_matches(team=team['_id'], page=page, per_page=per_page, sort='date:desc')
    
    format = request.args.get('format', 'html')
    if format == 'json':
        return jsonify(team=team, matches=matches)
    else:
        active_roster = octane_api.get_players_by_team_id(team_id)
        return render_template('team_info.html', team=team, active_roster=active_roster, matches=matches, page=page, per_page=per_page)

if __name__ == "__main__":
    app.run(debug=True)