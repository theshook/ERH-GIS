export default function () {
  var icons = {
    drrm: {
      name: 'DRRM',
      icon: '/drrm.png',
    },
    parking: {
      name: 'First Aid',
      icon: '/firstaid.png',
    },
    library: {
      name: 'Fire Men',
      icon: '/firemen.png',
    },
    info: {
      name: 'Police',
      icon: '/police.png',
    },
    nfa: {
      name: 'Requesting First Aid',
      icon: '/ineedfirstaid.png',
    },
    nff: {
      name: 'Requesting Fire Men',
      icon: '/ineedff.png',
    },
    np: {
      name: 'Requesting Police',
      icon: '/ineedpolice.png',
    },
    nhelp: {
      name: 'Need Help/Backup',
      icon: '/needhelp.svg',
    },
    solved: {
      name: 'Responded Incident',
      icon: '/grn-circle.png',
    },
    unsolved: {
      name: 'Unresponded Incident',
      icon: '/red-circle.png',
    },
    responding: {
      name: 'Responding Incident',
      icon: '/backup.png',
    },
  };
  var legend = document.getElementById('legend');
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML =
      '<img src="' + icon + '"  width="32px" height="32px"> ' + name;
    legend.appendChild(div);
  }
}
