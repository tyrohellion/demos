# Dependencies

[python](https://www.python.org)


[flask](https://flask.palletsprojects.com/en/3.0.x)


pip install octanegg


pip install jsonify

# changes to api wrapper

add this function to octanegg/api.py:


    def get_players_by_team_id(self, team_id: str) -> list:
        endpoint = f'{API_BASE_URL}/players'
        params = {'team': team_id}
        result = self._get_results(endpoint, params).get('players')
        return result

replace get_events with this:

    def get_events(self, name: Optional[str] = None, tier: Optional[str] = None, region: Optional[str] = None,
            mode: Optional[int] = None, group: Optional[str] = None, stages: Optional[str] = None, before: Optional[str] = None,
            after: Optional[str] = None, date: Optional[str] = None, sort: Optional[str] = None,
            order: Optional[str] = None, page: int = 1, per_page: int = 100) -> list:
endpoint = f'{API_BASE_URL}/events'
param_names = {'name', 'tier', 'region', 'mode', 'group', 'before', 'after', 'date', 'sort',
                'order', 'page', 'stages'}



## Acknowledgments

Fetches data from the octanegg api: https://zsr.octane.gg/


The python wrapper used is: https://github.com/amas0/octanegg
