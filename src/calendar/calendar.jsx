import { useState } from 'react'

const monthFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
	weekday: 'short',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
})

const colorStyles = {
	violet: 'bg-violet-100 text-violet-700 ring-violet-200',
	amber: 'bg-amber-100 text-amber-700 ring-amber-200',
	cyan: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
}

const toDateKey = (date) => [
	date.getFullYear(),
	String(date.getMonth() + 1).padStart(2, '0'),
	String(date.getDate()).padStart(2, '0'),
].join('-')

const getCalendarDays = (date) => {
	const year = date.getFullYear()
	const month = date.getMonth()
	const firstDay = new Date(year, month, 1)
	const startOffset = (firstDay.getDay() + 6) % 7
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const daysInPreviousMonth = new Date(year, month, 0).getDate()

	return Array.from({ length: 42 }, (_, index) => {
		const dayNumber = index - startOffset + 1
		const day = dayNumber < 1
			? new Date(year, month - 1, daysInPreviousMonth + dayNumber)
			: dayNumber > daysInMonth
				? new Date(year, month + 1, dayNumber - daysInMonth)
				: new Date(year, month, dayNumber)

		return {
			date: day,
			key: toDateKey(day),
			isCurrentMonth: day.getMonth() === month,
		}
	})
}

const getRelativeDateLabel = (date) => {
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(today.getDate() + 1)

	if (toDateKey(date) === toDateKey(today)) return 'Today'
	if (toDateKey(date) === toDateKey(tomorrow)) return 'Tomorrow'
	return weekdayFormatter.format(date)
}

function Calendar() {
	const today = new Date()
	const todayKey = toDateKey(today)
	const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
	const [selectedDate, setSelectedDate] = useState(todayKey)
	const [events, setEvents] = useState({
		[todayKey]: [
			{ title: 'Weekly planning', time: '09:30', color: 'violet' },
			{ title: 'Design review', time: '14:00', color: 'cyan' },
		],
		[toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))]: [
			{ title: 'Product sync', time: '11:00', color: 'amber' },
		],
	})
	const [eventTitle, setEventTitle] = useState('')

	const calendarDays = getCalendarDays(viewDate)
	const selectedDay = new Date(`${selectedDate}T12:00:00`)
	const selectedEvents = events[selectedDate] ?? []
	const upcomingEvents = Object.entries(events)
		.flatMap(([date, dayEvents]) => dayEvents.map((event) => ({ ...event, date })))
		.filter((event) => event.date >= todayKey)
		.sort((first, second) => first.date.localeCompare(second.date))
		.slice(0, 3)

	const changeMonth = (offset) => {
		setViewDate((currentDate) => new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + offset,
			1,
		))
	}

	const showToday = () => {
		setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
		setSelectedDate(todayKey)
	}

	const addEvent = (event) => {
		event.preventDefault()
		const title = eventTitle.trim()
		if (!title) return

		setEvents((currentEvents) => ({
			...currentEvents,
			[selectedDate]: [
				...(currentEvents[selectedDate] ?? []),
				{ title, time: 'All day', color: 'violet' },
			],
		}))
		setEventTitle('')
	}

	return (
		<main className="min-h-screen bg-[#f5f6f8] px-4 py-6 text-slate-900 sm:px-8 lg:px-12 lg:py-10">
			<div className="mx-auto max-w-7xl">
				<header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
							Personal workspace
						</p>
						<h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
							Calendar
						</h1>
					</div>
					<button
						type="button"
						onClick={showToday}
						className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
					>
						Today
					</button>
				</header>

				<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
					<section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
						<div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
							<div>
								<h2 className="text-xl font-semibold tracking-tight text-slate-950">
									{monthFormatter.format(viewDate)}
								</h2>
								<p className="mt-1 text-sm text-slate-400">Plan your days with intention</p>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									aria-label="Previous month"
									onClick={() => changeMonth(-1)}
									className="grid size-9 place-items-center rounded-full border border-slate-200 text-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
								>
									&#8592;
								</button>
								<button
									type="button"
									aria-label="Next month"
									onClick={() => changeMonth(1)}
									className="grid size-9 place-items-center rounded-full border border-slate-200 text-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
								>
									&#8594;
								</button>
							</div>
						</div>

						<div className="grid grid-cols-7 border-b border-slate-100 px-3 pt-4 sm:px-5">
							{Array.from({ length: 7 }, (_, index) => {
								const weekday = new Date(2024, 0, index + 1)
								return (
									<div key={index} className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
										{weekdayFormatter.format(weekday)}
									</div>
								)
							})}
						</div>

						<div className="grid grid-cols-7 px-3 pb-3 sm:px-5 sm:pb-5">
							{calendarDays.map(({ date, key, isCurrentMonth }) => {
								const dayEvents = events[key] ?? []
								const isSelected = selectedDate === key
								const isToday = todayKey === key

								return (
									<button
										type="button"
										key={key}
										onClick={() => setSelectedDate(key)}
										className={`group relative min-h-20 border-b border-r border-slate-100 p-2 text-left transition last:border-r-0 hover:bg-slate-50 sm:min-h-28 sm:p-3 ${isSelected ? 'bg-slate-50' : ''} ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}`}
									>
										<span className={`grid size-7 place-items-center rounded-full text-sm font-medium ${isToday ? 'bg-slate-950 text-white' : isSelected ? 'bg-slate-200 text-slate-950' : ''}`}>
											{date.getDate()}
										</span>
										<span className="mt-2 hidden space-y-1 sm:block">
											{dayEvents.slice(0, 2).map((event) => (
												<span key={`${key}-${event.title}`} className={`block truncate rounded px-1.5 py-1 text-[11px] font-medium ring-1 ring-inset ${colorStyles[event.color]}`}>
													{event.title}
												</span>
											))}
										</span>
										{dayEvents.length > 0 && <span className="absolute bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-slate-400 sm:hidden" />}
									</button>
								)
							})}
						</div>
					</section>

					<aside className="space-y-5">
						<section className="rounded-2xl border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
							<p className="text-sm text-slate-400">{getRelativeDateLabel(selectedDay)}</p>
							<h2 className="mt-1 text-2xl font-semibold tracking-tight">{shortDateFormatter.format(selectedDay)}</h2>
							<div className="mt-6 space-y-3">
								{selectedEvents.length > 0 ? selectedEvents.map((event) => (
									<div key={`${event.title}-${event.time}`} className="flex items-start gap-3 rounded-xl bg-white/10 p-3">
										<span className={`mt-1 size-2 rounded-full ${event.color === 'amber' ? 'bg-amber-300' : event.color === 'cyan' ? 'bg-cyan-300' : 'bg-violet-300'}`} />
										<div>
											<p className="text-sm font-medium">{event.title}</p>
											<p className="mt-1 text-xs text-slate-400">{event.time}</p>
										</div>
									</div>
								)) : <p className="rounded-xl border border-dashed border-white/15 px-3 py-4 text-sm text-slate-500">No events planned</p>}
							</div>
							<form onSubmit={addEvent} className="mt-5 flex gap-2 border-t border-white/10 pt-5">
								<input
									value={eventTitle}
									onChange={(event) => setEventTitle(event.target.value)}
									placeholder="Add an event"
									aria-label="Event title"
									className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
								/>
								<button type="submit" aria-label="Add event" className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-lg text-slate-950 transition hover:bg-cyan-200">
									+
								</button>
							</form>
						</section>

						<section className="rounded-2xl border border-slate-200/80 bg-white p-6">
							<div className="flex items-center justify-between">
								<h2 className="font-semibold text-slate-950">Coming up</h2>
								<span className="text-xs text-slate-400">Next 3</span>
							</div>
							<div className="mt-5 space-y-4">
								{upcomingEvents.map((event) => (
									<button
										type="button"
										key={`${event.date}-${event.title}`}
										onClick={() => {
											setSelectedDate(event.date)
											const eventDate = new Date(`${event.date}T12:00:00`)
											setViewDate(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1))
										}}
										className="flex w-full items-center gap-3 text-left"
									>
										<span className={`size-2 rounded-full ${event.color === 'amber' ? 'bg-amber-400' : event.color === 'cyan' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
										<span className="min-w-0 flex-1">
											<span className="block truncate text-sm font-medium text-slate-700">{event.title}</span>
											<span className="mt-1 block text-xs text-slate-400">{event.date === todayKey ? 'Today' : shortDateFormatter.format(new Date(`${event.date}T12:00:00`))} · {event.time}</span>
										</span>
									</button>
								))}
							</div>
						</section>
					</aside>
				</div>
			</div>
		</main>
	)
}

export default Calendar
