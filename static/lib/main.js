
$(window).on('action:composer.loaded', function (ev, data) { 
	$('[data-format="diceroller"]').hide();
	if (data.composerData.action === 'posts.reply' || data.composerData.action === 'topics.post') {
		$('[data-format="diceroller"]').show();
		$(`<div id="diceroller-field" style="display:none">
	<div id="type">
	   <select>
		  <option value="nothing">Nothing</option>
		  <option value="roll-dice">Roll Dice</option>
		  <option value="random-number">Random Number</option>
	   </select>
	</div>
	<div id="dice">
	   Amount: 
	   <input class="dice-amount"  placeholder="1" name="Dice Amount">
	   <select class="dice-type">
		  <option value="d4">d4</option>
		  <option value="d6">d6</option>
		  <option value="d8">d8</option>
		  <option value="d10">d10</option>
		  <option value="d12">d12</option>
		  <option value="d20">d20</option>
		  <option value="d100">d100</option>
	   </select>
	</div>
	<div id="random">Amount:
	   <input class="random-amount" placeholder="1" name="Random Amount">
	   From:
	   <input class="random-min" placeholder="1" name="Random Minimum">
	   To:
	   <input class="random-max" placeholder="100" name="Random Maximum">
	</div>
 </div>`).insertBefore('.category-tag-row');
	}
	else if (data.composerData.randomNumber || data.composerData.diceRoll) {
		var content = '';
		if (data.composerData.randomNumber) {
			content = `<div class="dice-results">Generated ${data.composerData.randomNumber.amount} random numbers from ${data.composerData.randomNumber.min} to ${data.composerData.randomNumber.max}:  [${data.composerData.randomNumber.result}]</div>`;
		}
		else if (data.composerData.diceRoll) {
			content = `<div class="random-results">Rolled ${data.composerData.diceRoll.query} dice: [${data.composerData.diceRoll.rolled}]</div> <div>Total:${data.composerData.diceRoll.result}</div>`;
		}
		$(content).insertBefore('.category-tag-row');
	}
});


$(document).on('change', '[id="type"]', function (e) {
	const selected = e.target.options[e.target.selectedIndex].value;
	if (selected === 'roll-dice') {
		$('#random').hide();
		$('#dice').show();
	}
	else if (selected === 'random-number') {
		$('#dice').hide();
		$('#random').show();
	}
	else {
		$('#random').hide();
		$('#dice').hide();
	}
});

$(document).on('click', '[data-format="diceroller"]', function () {
	$('#diceroller-field').toggle();
});

$(window).on('action:composer.submit', function (ev, data) {
	const numberField = data.composerEl.find('#diceroller-field');
	const type = numberField.find('#type select').val();
	if (type === 'roll-dice') {
		const diceAmount = numberField.find('#dice .dice-amount').val() || numberField.find('#dice .dice-amount').attr('placeholder');
		const diceRequest = diceAmount + numberField.find('#dice .dice-type').val()
		data.composerData.diceRoll = diceRequest;
	}
	if (type === 'random-number') {
		const randomAmount = numberField.find('#random .random-amount').val() || numberField.find('#random .random-amount').attr('placeholder');
		const randomMin = numberField.find('#random .random-min').val() || numberField.find('#random .random-min').attr('placeholder');
		const randomMax = numberField.find('#random .random-max').val() || numberField.find('#random .random-max').attr('placeholder');
		data.composerData.randomNumber = [randomAmount, randomMin, randomMax];
	}
});
