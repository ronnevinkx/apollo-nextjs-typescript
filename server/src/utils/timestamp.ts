export const timestamp = () => {
	const today = new Date();
	const hours =
		today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
	const minutes =
		today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
	const seconds =
		today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

	return `${hours}:${minutes}:${seconds}`;
};
