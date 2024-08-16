$(window).load(function () {
    // Animate loader off screen
    $(".loader").fadeOut("slow");;
});

//Ticket count and price minus and plus
$('.btn-number').click(function (e) {
    e.preventDefault();
    /* ticket count */
    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    var input = $("input[name='" + fieldName + "']");
    /* ticket price */
    var ticketPrice = $(this).parents('.ticketBox').attr('data-ticket-price');
    /* ticket type */
    var ticketType = $(this).parents('.ticketBox').find('.ticket-name').html();
    var total;

    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if (type == 'minus') {
            if (currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();

                console.log(input.val());
                total = ticketPrice * input.val();
                console.log(ticketPrice);
                activeTicket(this, input.val(), ticketPrice, total, ticketType);
            }
            if (parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if (type == 'plus') {

            if (currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();

                console.log(input.val());
                total = ticketPrice * input.val();
                console.log(ticketPrice);
                activeTicket(this, input.val(), ticketPrice, total, ticketType);
            }
            if (parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function () {
    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    name = $(this).attr('name');
    if (valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
});

function activeTicket(target, inputValue, ticketPrice, total, ticketType) {
    if (inputValue > 0) {
        $('#buyTicket .ticketBox').addClass('inActiveTicket');
        $(target).parents('.ticketBox').removeClass('inActiveTicket').addClass('activeTicket');
        $('.cart .btn').removeClass('disabled');
        $('.ticket-type').html(ticketType);
        $('.ticket-count').html(inputValue);
        $('.ticket-amount').html(ticketPrice);
        $('.total-amount').html(total);
    } else {
        $('#buyTicket .ticketBox').removeClass('inActiveTicket');
        $(target).parents('.ticketBox').removeClass('activeTicket inActiveTicket');
        $('.cart .btn').addClass('disabled');
        $('.ticket-type').html('');
        $('.ticket-count').html(inputValue);
        $('.ticket-amount').html(ticketPrice);
        $('.total-amount').html(total);
    }
}
// Function to check if Phantom wallet is installed
function isPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
}

// Function to connect to the Phantom wallet
async function connectWallet() {
    if (isPhantomInstalled()) {
        try {
            const response = await window.solana.connect();
            document.getElementById('wallet-status').textContent = "Connected";
            document.getElementById('wallet-address').textContent = "Wallet Address: " + response.publicKey.toString();
            console.log("Connected to wallet with public key:", response.publicKey.toString());
        } catch (err) {
            console.error("Failed to connect to wallet:", err);
        }
    } else {
        document.getElementById('wallet-status').textContent = "Phantom wallet is not installed.";
        console.log("Phantom wallet is not installed.");
    }
}

// Listen to the click event on the "Connect Wallet" button
document.querySelector('.btn-Sol.id-grad').addEventListener('click', connectWallet);

// Listen to account change events
if (isPhantomInstalled()) {
    window.solana.on("accountChanged", (newPublicKey) => {
        document.getElementById('wallet-address').textContent = "Wallet Address: " + newPublicKey.toString();
        console.log("Account changed to:", newPublicKey.toString());
    });
}