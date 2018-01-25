import { h, Component } from 'preact';
import { route } from 'preact-router';
import fetch from 'isomorphic-fetch';
import linkState from 'linkstate';

import GridList from 'preact-material-components/GridList';
import 'preact-material-components/GridList/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style';

import style from './style';

export default class CharacterList extends Component {
	state = {
		characters: [],
		characterName: ''
	};

	componentWillMount() {
		fetch('https://character-manager.azurewebsites.net/characters')
			.then(response => response.json())
			.then(data => {
				this.setState({
					characters: data
				});
			});
	}

	goToCharacter = path => () => {
		route(path);
	};

	showCreateCharacterDlg = () => {
		this.createCharacterDlg.MDComponent.show();
	}

	createCharacter = () => {
		const { characterName } = this.state;
		fetch(`http://localhost:3000/characters`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: characterName
			})
		}).then(() => {
			fetch('http://localhost:3000/characters')
				.then(response => response.json())
				.then(data => {
					this.setState({
						characters: data,
						characterName: ''
					});
				});
		});
	}

	getAffilitations = (id) => {
		const { characters } = this.state;
		const { affiliations } = characters.find(c => c.id === id);
		return affiliations
			.map(a => a.name)
			.join(', ');
	}

	render({}, { characters, characterName }) {
		return (
			<div class={style.list}>
				<h1>List</h1><Button raised onClick={this.showCreateCharacterDlg}>Create</Button>
				<Dialog ref={createCharacterDlg => {this.createCharacterDlg=createCharacterDlg;}}>
					<Dialog.Header>Scroll for me ;)</Dialog.Header>
					<Dialog.Body>
						<TextField label="name" value={characterName} onInput={linkState(this, 'characterName')} />
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton cancel>Decline</Dialog.FooterButton>
						<Dialog.FooterButton accept onClick={this.createCharacter}>Accept</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
				<GridList header-caption={false} with-icon-align="end" twoline-caption tile-gutter-2 tile-aspect="1x1">
					<GridList.Tiles>
						{characters.map(character => {
							const affiliation = this.getAffilitations(character.id);
							return (
								<GridList.Tile>
									<GridList.PrimaryTile>
										<GridList.PrimaryContentTile src={character.img} />
									</GridList.PrimaryTile>
									<GridList.SecondaryTile>
										<GridList.IconTile onClick={this.goToCharacter(`/character/${character.id}`)}>edit</GridList.IconTile>
										<GridList.TitleTile>{character.name}</GridList.TitleTile>
										<GridList.SupportTextTile>{affiliation}</GridList.SupportTextTile>
									</GridList.SecondaryTile>
								</GridList.Tile>
							);
						})}
					</GridList.Tiles>
				</GridList>
			</div>
		);
	}
}
