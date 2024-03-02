<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use App\Models\Role;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Projects', [
            'Projects' => Project::with('user')->orderBy('created_at', 'DESC')->get(),
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
    public function store(ProjectRequest $request)
    {

        $validate = $request->validated();

        $request->safe()->only(['name', 'description', 'thumbnail']);

        if ($request->thumbnail) $thumbnail = $request->thumbnail->store('thumbnails');
        else $thumbnail = null;

        Project::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
            'nb_user' => 1,
            'thumbnail' => $thumbnail,
            'status' => "in_progress",
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $project = Project::find($id);
        if ($request->name) $project->name = $request->name;
        if ($request->description) $project->description = $request->description;
        if ($request->thumbnail) $project->thumbnail = $request->thumbnail;

        $project->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::all()->where('project_id', $id)->each->delete();
        Ticket::all()->where('project_id', $id)->each->delete();
        Project::find($id)->delete();
    }
}
