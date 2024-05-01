from flask import Flask, request, jsonify, render_template
from octanegg import Octane

app = Flask(__name__)

# Initialize Octane object
octane_api = Octane()

# Define API routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/news')
def news():
    return render_template('news.html')

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

    # Search for players based on the query
    players = octane_api.get_players(tag=query)

    # Search for teams based on the query
    teams = octane_api.get_teams(name=query)

    events = octane_api.get_events(name=query)

    # Return the search results as JSON
    return jsonify(players=players, teams=teams, events=events)

@app.route('/events')
def get_events():
    name = request.args.get('name')
    tier = request.args.get('tier')
    region = request.args.get('region')
    mode = request.args.get('mode')
    group = request.args.get('group')
    before = request.args.get('before')
    after = request.args.get('after')
    date = request.args.get('date')
    sort = request.args.get('sort')
    order = request.args.get('order')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 100))

    events = octane_api.get_events(name=name, tier=tier, region=region, mode=mode, group=group, 
                                    before=before, after=after, date=date, sort=sort, order=order, 
                                    page=page, per_page=per_page)
    return jsonify(events=events)

@app.route('/event/<event_id>')
def get_event(event_id):
    event = octane_api.get_event(event_id)
    participants = octane_api.get_event_participants(event_id)
    page = request.args.get('page', default=1, type=int)  # Get the page number from the request
    per_page = 10  # Number of matches per page
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

@app.route('/matches')
def get_matches():
    event = request.args.get('event')
    stage = request.args.get('stage')
    qualifier = request.args.get('qualifier')
    tier = request.args.get('tier')
    region = request.args.get('region')
    mode = request.args.get('mode')
    group = request.args.get('group')
    before = request.args.get('before')
    after = request.args.get('after')
    best_of = request.args.get('bestOf')
    reverse_sweep = request.args.get('reverseSweep')
    reverse_sweep_attempt = request.args.get('reverseSweepAttempt')
    player = request.args.get('player')
    team = request.args.get('team')
    sort = request.args.get('sort')
    order = request.args.get('order')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 100))

    matches = octane_api.get_matches(event=event, stage=stage, qualifier=qualifier, 
                                      tier=tier, region=region, mode=mode, group=group, 
                                      before=before, after=after, best_of=best_of, 
                                      reverse_sweep=reverse_sweep, reverse_sweep_attempt=reverse_sweep_attempt, 
                                      player=player, team=team, sort=sort, order=order, 
                                      page=page, per_page=per_page)
    return jsonify(matches=matches)

@app.route('/match/<match_id>')
def get_match(match_id):
    match = octane_api.get_match(match_id)
    return jsonify(match=match)

@app.route('/match/<match_id>/games')
def get_match_games(match_id):
    games = octane_api.get_match_games(match_id)
    return jsonify(games=games)

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
    return jsonify(game=game)

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
    page = request.args.get('page', default=1, type=int)  # Get the page number from the request
    per_page = 10  # Number of matches per page
    matches = octane_api.get_matches(player=player['_id'], page=page, per_page=per_page, sort='date:desc')
    format = request.args.get('format', 'html')  # Default format is HTML
    
    if format == 'json':
        return jsonify(player=player, matches=matches)  # Return player data as JSON
    else:
        return render_template('player_info.html', player=player, matches=matches, page=page, per_page=per_page)  # Render the player_info.html template

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
    page = request.args.get('page', default=1, type=int)  # Get the page number from the request
    per_page = 10  # Number of matches per page
    matches = octane_api.get_matches(team=team['_id'], page=page, per_page=per_page, sort='date:desc')
    
    format = request.args.get('format', 'html')  # Default format is HTML
    if format == 'json':
        # Return team data as JSON
        return jsonify(team=team, matches=matches)
    else:
        # Render the team_info.html template
        active_roster = octane_api.get_players_by_team_id(team_id)
        return render_template('team_info.html', team=team, active_roster=active_roster, matches=matches, page=page, per_page=per_page)

#function to return active roster
@app.route('/players/<team_id>')
def get_team_roster(team_id):
    team = octane_api.get_team(team_id)
    if 'name' in team:
        active_roster = octane_api.get_players(team=team['name'])
        return jsonify(active_roster=active_roster)
    else:
        return jsonify(error='Team name not found'), 404

@app.route('/active-teams')
def get_active_teams():
    active_teams = octane_api.get_active_teams()
    return jsonify(active_teams=active_teams)

if __name__ == "__main__":
    app.run(debug=True)