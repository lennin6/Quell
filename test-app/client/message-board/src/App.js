import { Quellify, lokiClientCache } from './quell-client/src/Quellify';
import { useRef, useState } from 'react';
import './App.css';

function App() {
  const fetchInfo = useRef(null);
  const createInfo = useRef(null);
  const deleteInfo = useRef(null);
  const updatedID = useRef(null);
  const updatedName = useRef(null);

  console.log(lokiClientCache.data);

  const queryMap = { getCharacter: 'Character' };
  const mutationMap = {
    createCharacter: 'Character',
    deleteCharacter: 'Character',
  };
  const map = {
    Character: 'Character',
  };

  const [cache, setCache] = useState(lokiClientCache.data);

  const handleFetchClick = async (e) => {
    e.preventDefault();
    let startTime = new Date();
    console.log(lokiClientCache.data);

    const _id = fetchInfo.current.value;
    console.log(_id);
    // const results = await fetch('http://localhost:3434/graphql', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: `{
    //     getCharacter(_id: ${_id}){
    //       _id
    //       name
    //     }
    //   }`,
    //   }),
    // });

    const query = `query {
      getCharacter(_id: ${_id}){
        _id
       name
      }
     }`;

    const parsedResponse = await Quellify(
      'http://localhost:3434/graphql',
      query,
      mutationMap,
      map,
      queryMap
    );

    let endTime = new Date();
    let diff = endTime - startTime;
    console.log(parsedResponse);
    const characterData = parsedResponse.data.data.getCharacter;
    const li = createLi(characterData, diff);
    const characterBoard = document.getElementById('character-list');
    characterBoard.appendChild(li);

    setCache([...lokiClientCache.data]);

    //update messageboard after creating new message
  };

  const clearCache = () => {
    lokiClientCache.clear();
    console.log(lokiClientCache);
    setCache(lokiClientCache.data);
  };

  const handleCreateClick = async (e) => {
    e.preventDefault();
    let startTime = new Date();

    const name = createInfo.current.value;
    console.log(name);
    const results = await fetch('http://localhost:3434/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
        createCharacter(name: "${name}"){
          _id
          name
        }
      }`,
      }),
    });

    let endTime = new Date();
    let diff = endTime - startTime;
    const parsedResponse = await results.json();
    const characterData = parsedResponse.data.createCharacter;
    const li = createLi(characterData, diff);
    const characterBoard = document.getElementById('character-list');
    characterBoard.appendChild(li);

    setCache([...lokiClientCache.data]);
  };

  const createLi = (character, time) => {
    //create button
    const name = character.name;
    const _id = character._id;
    let idAndName = `id: ${_id} \n name: ${name} \n timeElapsed:${time} ms`;
    //create new Li and append button to it
    const newLi = document.createElement('li');
    newLi.innerText = idAndName;
    return newLi;
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    let startTime = new Date();

    const _id = deleteInfo.current.value;
    console.log(_id);
    const results = await fetch('http://localhost:3434/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation{
        deleteCharacter(_id: ${_id}){
          _id
          name
        }
      }`,
      }),
    });

    let endTime = new Date();
    let diff = endTime - startTime;
    const parsedResponse = await results.json();
    const characterData = parsedResponse.data.deleteCharacter;
    const li = createLi(characterData, diff);
    let innerText = `(DELETED)\n`;
    innerText += li.innerText;
    li.innerText = innerText;
    const characterBoard = document.getElementById('character-list');
    characterBoard.appendChild(li);

    setCache([...lokiClientCache.data]);
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    let startTime = new Date();

    const _id = updatedID.current.value;
    const name = updatedName.current.value;

    console.log(_id, name);

    console.log(_id);
    const results = await fetch('http://localhost:3434/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation{
        updateCharacter(_id: ${_id},name: "${name}"){
          _id
          name
        }
      }`,
      }),
    });
    const parsedResponse = await results.json();
    console.log(parsedResponse);
    let endTime = new Date();
    let diff = endTime - startTime;
    console.log(parsedResponse);
    const characterData = parsedResponse.data.updateCharacter;
    const li = createLi(characterData, diff);
    let innerText = `UPDATED\n`;
    innerText += li.innerText;
    li.innerText = innerText;
    const characterBoard = document.getElementById('character-list');
    characterBoard.appendChild(li);

    setCache([...lokiClientCache.data]);
  };

  const handleClearClick = () => {
    const characterBoard = document.getElementById('character-list');
    characterBoard.innerHTML = '';
  };

  return (
    <div id='container'>
      <h1>GET STARWARS CHARACTER</h1>
      <div className='row'>
        <input id='id' ref={fetchInfo} placeholder='id' type='text' />
        <button onClick={handleFetchClick} id='fetch'>
          FETCH
        </button>
        <input
          id='createName'
          ref={createInfo}
          placeholder='name'
          type='text'
        />
        <button onClick={handleCreateClick} id='create'>
          CREATE
        </button>
        <input
          id='deleteid'
          ref={deleteInfo}
          placeholder='delete'
          type='text'
        />
        <button onClick={handleDeleteClick} id='delete'>
          DELETE
        </button>
        <div style={{ display: 'flex' }}>
          <input
            className='updateInput'
            ref={updatedID}
            placeholder='reference id'
            type='text'
          />
          <input
            className='updateInput'
            ref={updatedName}
            placeholder='new name'
            type='text'
          />
          <button onClick={handleUpdateClick} id='update'>
            UPDATE
          </button>
        </div>
      </div>
      <ul id='character-list'></ul>
      <div id='clear-btn-container'>
        <button onClick={handleClearClick} id='clear'>
          Clear Board
        </button>
      </div>
      <div style={{ height: '50px' }}>
        <button id='cacheButton' onClick={clearCache}>
          Clear Cache
        </button>
      </div>
      <div className='cacheBoard'>
        Cache Board
        {cache.map((el, key) => {
          const cacheID = JSON.stringify(el.cacheID);
          const meta = JSON.stringify(el.meta);

          return (
            <li key={key}>
              {` id: ${el.id} \n
              cacheID: ${cacheID}
             \n
             queryType: ${el.queryType} \n
             meta: ${meta}
              \n
              $loki: ${el.$loki}`}
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default App;
