const logo = new Proxy({"src":"/_astro/FaunaKite_LogoBlanco-03.Da3Ycs54.png","width":477,"height":138,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/assets/logos/FaunaKite_LogoBlanco-03.png";
							}
							
							return target[name];
						}
					});

export { logo as l };
