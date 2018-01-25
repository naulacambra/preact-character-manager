import { h, Component } from 'preact';
import { route } from 'preact-router';
import linkState from 'linkstate';

import FormField from 'preact-material-components/FormField';
import 'preact-material-components/FormField/style';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style';

import style from './style';

export default class Character extends Component {
	state = {
		character: {}
	};

	componentWillReceiveProps(nextProps) {
		const { characterId } = nextProps;
		fetch(`http://localhost:3000/characters/${characterId}`)
			.then(response => response.json())
			.then(data => {
				this.setState({
					character: data
				});
			});
	}

	goToList = () => {
		route('/list');
	};

	// update character
	updateCharacter = () => {
		const { character } = this.state;
		fetch(`http://localhost:3000/characters`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(character)
		}).then(() => {
			this.bar.MDComponent.show({
				message: 'Character updated!'
			});
			this.goToList();
		});
	};

	updateCharacter = this.updateCharacter.bind(this);

	render({ characterId }, { character }) {
		return (
			<div class={style.character}>
				<span class="catalog-back">
					<a href="/list" class="mdc-toolbar__menu-icon"><i class="material-icons"></i></a>
				</span>
				<h1>{character.name}</h1>
				<FormField>
					<TextField label="Name" value={character.name} onInput={linkState(this, 'character.name')} />
					<TextField label="Image" value={character.img} onInput={linkState(this, 'character.img')} />
					<Button raised onClick={this.updateCharacter} >Save</Button>
				</FormField>
				<Snackbar ref={bar => { this.bar=bar; }} />
			</div>
		);
	}
}
