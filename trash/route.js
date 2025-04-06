// Route to handle the report page
router.get('/report_page', async (req, res) => {
    try {
        // Fetch unique year-month data from the database
        const rows = await ReportDetail.getUniqueYearMonth();

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(item => ({
                ...item,
                month_name: monthNames[item.month - 1] // Convert month number to name
            }))
        };

        // Render the report page
        res.render('report/report_page', context);
    } catch (err) {
        console.error('Error fetching unique year-month data:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/report_detail', async (req, res) => {
    try {
        // Fetch all reports from the database
        const rows = await ReportDetail.all();

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(row => ({
                ...row,
                date: moment(row.date).format('YYYY-MM-DD'),
                // Uncomment if needed:
                // start_time: moment(row.start_time).format('hh:mm:ss'),
                // stop_time: moment(row.stop_time).format('hh:mm:ss')
            }))
        };

        // Render the report detail page
        res.render('report/report_detail', context);
    } catch (err) {
        console.error('Error fetching all reports:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Dynamic route to fetch reports by year and month
router.get('/report_detail/:year/:month', async (req, res) => {
    try {
        const { year, month } = req.params;

        // Fetch reports for the specified year and month
        const rows = await ReportDetail.getdate(year, month);

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(row => ({
                ...row,
                date: moment(row.date).format('YYYY-MM-DD')
            }))
        };

        // Render the report detail page
        res.render('report/report_detail', context);
    } catch (err) {
        console.error('Error fetching reports by year/month:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/', async (req, res) => {
	ReportDetail.all((err, rows) => {
		let context = {
			title: 'Report Details',
			reports: rows.map(row => {
				return {
					...row, 
					date: moment(row.date).format('YYYY MMMM'),
					year: moment(row.date).format('YYYY'),
					month: moment(row.date).format('MMMM')
				}
			})
		};
		res.render('home/index', context);
	});
});