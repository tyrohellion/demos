# Dependencies

[python](https://www.python.org)
[flask](https://flask.palletsprojects.com/en/3.0.x)
pip install octanegg
pip install jsonify

# changes to api wrapper

add this function to octanegg/api.py:
    ```sh
    def get_players_by_team_id(self, team_id: str) -> list:
        endpoint = f'{API_BASE_URL}/players'
        params = {'team': team_id}
        result = self._get_results(endpoint, params).get('players')
        return result
    ```

## Acknowledgments

Fetches data from the octanegg api: https://zsr.octane.gg/
The python wrapper used is: https://github.com/amas0/octanegg
