<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    public function home(): \Inertia\Response
    {
        return Inertia::render('MyIssues', [
            'CreateIssues' => auth()->user()->CreateTicket()->with('project')->get(),
            'AssignedIssues' => auth()->user()->AssignedTicket()->with('project')->get(),
            'Projects' => auth()->user()->project()->with('role')->get(),
            'User' => auth()->user()->only('username', 'first_name', 'last_name', 'email', 'thumbnail'),
        ]);
    }
}
