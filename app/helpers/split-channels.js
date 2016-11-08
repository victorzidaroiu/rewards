export default (channelsString) => {
  const channels = channelsString.split('|');
	const combinedChannels = [];

	channels.forEach(channel1 => {
		channels.forEach(channel2 => {
			if (channel1 !== channel2)
				combinedChannels.push(channel1 + '_AND_' + channel2);
		});
	});

	return channels.concat(combinedChannels);
}
