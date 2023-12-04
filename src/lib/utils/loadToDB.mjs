export async function loadToDB(fileObj, fileName, supabase) {
	try {
		fileName = fileName.replace(' ', '-');
		const { data, error } = await supabase.storage
			.from('researchNarratives')
			.upload('public/' + fileName, fileObj);

		let fileUrl = await supabase.storage
			.from('researchNarratives')
			.getPublicUrl('public/' + fileName);

		console.log(fileUrl.data.publicUrl);
		return fileUrl.data.publicUrl;
	} catch (error) {
		console.error('Error uploading file:', error.message);
	}
}
