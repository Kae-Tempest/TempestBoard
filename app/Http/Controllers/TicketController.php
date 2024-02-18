<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Tickets', [
            'Tickets' => Ticket::with('user')->orderBy('created_at', 'DESC')->with('project')->get(),
            'ConnectUser' => Auth::user(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|integer|min:1',
            'title' => 'required|string|max:255|min:3',
            'description' => 'required|string|max:500|min:3',
            'priority' => 'required|string|max:255|min:3',
        ]);
        
        $ticket = Ticket::create([
            'creator_id' => Auth::id(),
            'assigned_id' => Auth::id(),
            'project_id' => $request->project_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => "open",
            'priority' => $request->priority,
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('Ticket', [
            'Ticket' => Ticket::with('user')->with('project')->find($id),
            'ConnectUser' => Auth::user(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
